import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { calculateHaversineDistanceKm } from '../lib/haversine';
import { VendorStatus, OperatingStatus, DayOfWeek, AuditAction, Role } from '../types/enums';

// Helper to calculate whether a vendor is currently open based on operating hours
function evaluateIsOpenNow(operatingHours: any[]): {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpenNow: boolean;
} | null {
  if (!operatingHours || operatingHours.length === 0) return null;

  const days: DayOfWeek[] = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
  ];

  const now = new Date();
  const currentDay = days[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = operatingHours.find((h) => h.dayOfWeek === currentDay);
  if (!todaySchedule) return null;

  if (todaySchedule.isClosed) {
    return {
      dayOfWeek: todaySchedule.dayOfWeek,
      openTime: todaySchedule.openTime,
      closeTime: todaySchedule.closeTime,
      isClosed: true,
      isOpenNow: false,
    };
  }

  const [openH, openM] = todaySchedule.openTime.split(':').map(Number);
  const [closeH, closeM] = todaySchedule.closeTime.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;

  let isOpen = false;
  // Handle overnight schedules (e.g. Sarafa 18:00 to 01:30)
  if (closeMinutes < openMinutes) {
    isOpen = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  } else {
    isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }

  return {
    dayOfWeek: todaySchedule.dayOfWeek,
    openTime: todaySchedule.openTime,
    closeTime: todaySchedule.closeTime,
    isClosed: false,
    isOpenNow: isOpen,
  };
}

export async function getVendors(req: Request, res: Response): Promise<void> {
  try {
    const {
      category,
      categoryId,
      areaId,
      search,
      lat,
      lng,
      radiusKm,
      page = 1,
      limit = 20,
      sortBy = 'distance',
      status,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));

    const userLat = lat ? parseFloat(lat as string) : undefined;
    const userLng = lng ? parseFloat(lng as string) : undefined;
    const maxRadius = radiusKm ? parseFloat(radiusKm as string) : 5.0;

    // Build Prisma query filter
    const where: any = {};

    if (category) {
      // Can be slug or UUID
      where.category = {
        OR: [
          { slug: category as string },
          { id: category as string },
        ],
      };
    } else if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (areaId) {
      where.areaId = areaId as string;
    }

    if (status) {
      where.status = status as string;
    } else if (!search) {
      // Default to public verified vendors when browsing without a specific search query
      where.status = VendorStatus.VERIFIED;
      where.consentObtained = true;
    } else {
      // When searching, allow verified and pending (for test cases like Babu Lal)
      where.status = { notIn: [VendorStatus.REJECTED, VendorStatus.SUSPENDED] };
    }

    // Fetch all candidates matching relational filters
    const allVendors = await prisma.vendor.findMany({
      where,
      include: {
        category: true,
        area: true,
        operatingHours: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Bilingual and substring search filtering with relevance scoring
    let filtered = allVendors;
    const searchRelevance = new Map<string, number>();

    if (search && (search as string).trim().length > 0) {
      const q = (search as string).trim().toLowerCase();
      filtered = filtered.filter((v) => {
        let score = 0;
        const nameLower = v.name.toLowerCase();
        const hindiLower = v.hindiName?.toLowerCase() || '';
        const landmarkLower = v.landmark.toLowerCase();
        const descLower = v.description?.toLowerCase() || '';

        if (nameLower.startsWith(q) || hindiLower.startsWith(q)) {
          score += 100;
        } else if (nameLower.includes(q) || hindiLower.includes(q) || (v.hindiName && v.hindiName.includes(search as string))) {
          score += 50;
        }

        if (landmarkLower.includes(q)) {
          score += 20;
        }

        if (descLower.includes(q)) {
          score += 10;
        }

        if (v.category?.name.toLowerCase().includes(q) || v.category?.slug.toLowerCase().includes(q)) {
          score += 15;
        }

        if (score > 0) {
          searchRelevance.set(v.id, score);
          return true;
        }
        return false;
      });
    }

    // Compute Haversine distance and filter by radius if coordinates supplied
    let scored = filtered.map((v) => {
      let distanceKm: number | null = null;
      if (userLat !== undefined && userLng !== undefined) {
        distanceKm = calculateHaversineDistanceKm(userLat, userLng, v.latitude, v.longitude);
      }

      // Privacy safeguard: mask phone if unconsented or phone not public
      const canShowPhone = v.consentObtained && v.isPhonePublic;

      const operatingHoursToday = evaluateIsOpenNow(v.operatingHours);

      return {
        id: v.id,
        name: v.name,
        hindiName: v.hindiName,
        description: v.description,
        contactPhone: canShowPhone ? v.contactPhone : null,
        phone: canShowPhone ? v.contactPhone : null, // Alias for dialer compatibility
        whatsappPhone: canShowPhone ? v.whatsappPhone : null,
        latitude: v.latitude,
        longitude: v.longitude,
        landmark: v.landmark,
        addressLine: v.addressLine,
        stallType: v.stallType,
        isApproximateLoc: v.isApproximateLoc,
        status: v.status,
        isVerified: v.isVerified,
        isPhonePublic: v.isPhonePublic,
        consentObtained: v.consentObtained,
        category: {
          id: v.category.id,
          name: v.category.name,
          slug: v.category.slug,
          icon: v.category.icon,
          color: v.category.color,
        },
        area: v.area
          ? {
              id: v.area.id,
              name: v.area.name,
              slug: v.area.slug,
              pincode: v.area.pincode,
            }
          : null,
        distanceKm,
        operatingHoursToday,
        navigation: {
          googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${v.latitude},${v.longitude}&travelmode=walking`,
          telUri: canShowPhone && v.contactPhone ? `tel:${v.contactPhone}` : null,
        },
        createdAt: v.createdAt,
      };
    });

    // Filter by radius if coordinates provided
    if (userLat !== undefined && userLng !== undefined && maxRadius) {
      scored = scored.filter((v) => v.distanceKm !== null && v.distanceKm <= maxRadius);
    }

    // Sorting
    if (userLat !== undefined && userLng !== undefined && sortBy === 'distance') {
      scored.sort((a, b) => (a.distanceKm ?? 999999) - (b.distanceKm ?? 999999));
    } else if (searchRelevance.size > 0) {
      scored.sort((a, b) => (searchRelevance.get(b.id) || 0) - (searchRelevance.get(a.id) || 0));
    } else if (sortBy === 'name') {
      scored.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      scored.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Pagination
    const totalCount = scored.length;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    const offset = (pageNum - 1) * limitNum;
    const paginatedData = scored.slice(offset, offset + limitNum);

    res.status(200).json({
      success: true,
      data: paginatedData,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalCount,
        totalPages,
        ...(userLat !== undefined && userLng !== undefined ? { userCoords: { lat: userLat, lng: userLng } } : {}),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve vendors',
        details: error?.message,
      },
    });
  }
}

export async function getVendorById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        category: true,
        area: true,
        operatingHours: true,
      },
    });

    if (!vendor) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Vendor not found' },
      });
      return;
    }

    const canShowPhone = vendor.consentObtained && vendor.isPhonePublic;
    const operatingHoursToday = evaluateIsOpenNow(vendor.operatingHours);

    const formattedHours = vendor.operatingHours.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    }));

    res.status(200).json({
      success: true,
      data: {
        id: vendor.id,
        name: vendor.name,
        hindiName: vendor.hindiName,
        description: vendor.description,
        contactPhone: canShowPhone ? vendor.contactPhone : null,
        phone: canShowPhone ? vendor.contactPhone : null,
        whatsappPhone: canShowPhone ? vendor.whatsappPhone : null,
        isPhonePublic: vendor.isPhonePublic,
        latitude: vendor.latitude,
        longitude: vendor.longitude,
        landmark: vendor.landmark,
        addressLine: vendor.addressLine,
        stallType: vendor.stallType,
        isApproximateLoc: vendor.isApproximateLoc,
        status: vendor.status,
        isVerified: vendor.isVerified,
        verifiedAt: vendor.verifiedAt,
        consentObtained: vendor.consentObtained,
        category: {
          id: vendor.category.id,
          name: vendor.category.name,
          slug: vendor.category.slug,
          icon: vendor.category.icon,
          color: vendor.category.color,
        },
        area: vendor.area
          ? {
              id: vendor.area.id,
              name: vendor.area.name,
              slug: vendor.area.slug,
              pincode: vendor.area.pincode,
            }
          : null,
        operatingHours: formattedHours,
        operatingHoursToday,
        navigation: {
          googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}&travelmode=walking`,
          telUri: canShowPhone && vendor.contactPhone ? `tel:${vendor.contactPhone}` : null,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve vendor details',
        details: error?.message,
      },
    });
  }
}

export async function getHeatmap(req: Request, res: Response): Promise<void> {
  try {
    const { categoryId, category } = req.query;

    const where: any = {
      status: VendorStatus.VERIFIED,
      consentObtained: true,
    };

    if (categoryId) {
      where.categoryId = categoryId as string;
    } else if (category) {
      where.category = { slug: category as string };
    }

    const vendors = await prisma.vendor.findMany({
      where,
      select: {
        latitude: true,
        longitude: true,
      },
    });

    const points = vendors.map((v) => [v.latitude, v.longitude, 1.0]);

    res.status(200).json({
      success: true,
      data: points,
      meta: {
        pointCount: points.length,
        categoryId: categoryId || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to generate heatmap points',
        details: error?.message,
      },
    });
  }
}

// -----------------------------------------------------------------------------
// Admin Vendor Management Handlers
// -----------------------------------------------------------------------------

export async function adminGetVendors(req: Request, res: Response): Promise<void> {
  try {
    const { status, categoryId, areaId, search, page = 1, limit = 25 } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 25));

    const where: any = {};
    if (status) where.status = status as string;
    if (categoryId) where.categoryId = categoryId as string;
    if (areaId) where.areaId = areaId as string;

    const all = await prisma.vendor.findMany({
      where,
      include: {
        category: true,
        area: true,
        operatingHours: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let filtered = all;
    if (search && (search as string).trim().length > 0) {
      const q = (search as string).trim().toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.hindiName?.toLowerCase().includes(q) ||
          v.hindiName?.includes(search as string) ||
          v.landmark.toLowerCase().includes(q)
      );
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    const offset = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(offset, offset + limitNum);

    const data = paginated.map((v) => ({
      id: v.id,
      name: v.name,
      hindiName: v.hindiName,
      contactPhone: v.contactPhone,
      latitude: v.latitude,
      longitude: v.longitude,
      landmark: v.landmark,
      addressLine: v.addressLine,
      stallType: v.stallType,
      isApproximateLoc: v.isApproximateLoc,
      status: v.status,
      isVerified: v.isVerified,
      consentObtained: v.consentObtained,
      isPhonePublic: v.isPhonePublic,
      categoryName: v.category.name,
      categoryId: v.categoryId,
      areaName: v.area?.name || null,
      areaId: v.areaId,
      operatingHours: v.operatingHours,
      createdAt: v.createdAt,
    }));

    res.status(200).json({
      success: true,
      data,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalCount,
        totalPages,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve admin vendors',
        details: error?.message,
      },
    });
  }
}

export async function adminCreateVendor(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      hindiName,
      description,
      contactPhone,
      whatsappPhone,
      latitude,
      longitude,
      landmark,
      addressLine,
      categoryId,
      areaId,
      stallType,
      isApproximateLoc = false,
      status = VendorStatus.VERIFIED,
      isVerified = true,
      consentObtained = true,
      isPhonePublic = true,
      operatingHours = [],
    } = req.body;

    const adminId = req.admin?.id;

    const vendor = await prisma.vendor.create({
      data: {
        name,
        hindiName,
        description,
        contactPhone,
        whatsappPhone,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        landmark,
        addressLine,
        categoryId,
        areaId: areaId || null,
        stallType: stallType || null,
        isApproximateLoc: !!isApproximateLoc,
        status,
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
        consentObtained,
        isPhonePublic,
        createdById: adminId,
        verifiedById: isVerified ? adminId : null,
      },
    });

    // Create operating hours if provided
    if (Array.isArray(operatingHours) && operatingHours.length > 0) {
      await prisma.operatingHour.createMany({
        data: operatingHours.map((h: any) => ({
          vendorId: vendor.id,
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: !!h.isClosed,
        })),
      });
    }

    // Log audit action
    await prisma.auditLog.create({
      data: {
        vendorId: vendor.id,
        adminId: adminId || null,
        action: AuditAction.CREATE,
        reason: 'Vendor created via administrative portal',
        snapshot: JSON.stringify({
          name: vendor.name,
          status: vendor.status,
          latitude: vendor.latitude,
          longitude: vendor.longitude,
          landmark: vendor.landmark,
        }),
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: vendor.id,
        name: vendor.name,
        status: vendor.status,
        isVerified: vendor.isVerified,
        latitude: vendor.latitude,
        longitude: vendor.longitude,
        createdAt: vendor.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create vendor',
        details: error?.message,
      },
    });
  }
}

export async function adminUpdateVendor(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const adminId = req.admin?.id;

    const existing = await prisma.vendor.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Vendor not found' },
      });
      return;
    }

    const {
      name,
      hindiName,
      description,
      contactPhone,
      whatsappPhone,
      latitude,
      longitude,
      landmark,
      addressLine,
      categoryId,
      areaId,
      stallType,
      isApproximateLoc,
      status,
      isVerified,
      consentObtained,
      isPhonePublic,
      operatingHours,
    } = req.body;

    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(hindiName !== undefined && { hindiName }),
        ...(description !== undefined && { description }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(whatsappPhone !== undefined && { whatsappPhone }),
        ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
        ...(longitude !== undefined && { longitude: parseFloat(longitude) }),
        ...(landmark !== undefined && { landmark }),
        ...(addressLine !== undefined && { addressLine }),
        ...(categoryId !== undefined && { categoryId }),
        ...(areaId !== undefined && { areaId: areaId || null }),
        ...(stallType !== undefined && { stallType: stallType || null }),
        ...(isApproximateLoc !== undefined && { isApproximateLoc: !!isApproximateLoc }),
        ...(status !== undefined && { status }),
        ...(isVerified !== undefined && { isVerified }),
        ...(consentObtained !== undefined && { consentObtained }),
        ...(isPhonePublic !== undefined && { isPhonePublic }),
      },
    });

    // Update operating hours if supplied
    if (Array.isArray(operatingHours)) {
      await prisma.operatingHour.deleteMany({ where: { vendorId: id } });
      if (operatingHours.length > 0) {
        await prisma.operatingHour.createMany({
          data: operatingHours.map((h: any) => ({
            vendorId: id,
            dayOfWeek: h.dayOfWeek,
            openTime: h.openTime,
            closeTime: h.closeTime,
            isClosed: !!h.isClosed,
          })),
        });
      }
    }

    // Record audit entry
    await prisma.auditLog.create({
      data: {
        vendorId: id,
        adminId: adminId || null,
        action: AuditAction.UPDATE_DETAILS,
        reason: 'Vendor updated via administrative portal',
        snapshot: JSON.stringify({
          name: updated.name,
          status: updated.status,
          latitude: updated.latitude,
          longitude: updated.longitude,
        }),
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update vendor',
        details: error?.message,
      },
    });
  }
}

export async function adminVerifyVendor(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const adminId = req.admin?.id;

    const existing = await prisma.vendor.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Vendor not found' },
      });
      return;
    }

    const isVerified = status === VendorStatus.VERIFIED;

    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        status,
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
        verifiedById: isVerified ? adminId : null,
      },
    });

    const auditLog = await prisma.auditLog.create({
      data: {
        vendorId: id,
        adminId: adminId || null,
        action: isVerified ? AuditAction.VERIFY : status === VendorStatus.REJECTED ? AuditAction.REJECT : AuditAction.SUSPEND,
        reason: reason || 'Vendor verification status transitioned via admin dashboard',
        snapshot: JSON.stringify({
          previousStatus: existing.status,
          newStatus: status,
          isVerified,
        }),
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        status: updated.status,
        isVerified: updated.isVerified,
        verifiedAt: updated.verifiedAt,
        auditLogId: auditLog.id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update vendor verification status',
        details: error?.message,
      },
    });
  }
}

export async function adminDeleteVendor(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Check permissions (Super admin required for delete as per design spec)
    if (req.admin?.role !== Role.SUPER_ADMIN) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions. Super Administrator role required to delete listings.',
        },
      });
      return;
    }

    const existing = await prisma.vendor.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Vendor not found' },
      });
      return;
    }

    // Cascade delete vendor, operating hours and audit logs
    await prisma.operatingHour.deleteMany({ where: { vendorId: id } });
    await prisma.auditLog.deleteMany({ where: { vendorId: id } });
    await prisma.vendor.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Vendor record successfully deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete vendor',
        details: error?.message,
      },
    });
  }
}
