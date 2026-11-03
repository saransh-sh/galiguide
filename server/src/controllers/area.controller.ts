import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { VendorStatus } from '../types/enums';

export async function getAreas(req: Request, res: Response): Promise<void> {
  try {
    const areas = await prisma.area.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            vendors: {
              where: {
                status: VendorStatus.VERIFIED,
                consentObtained: true,
              },
            },
          },
        },
      },
    });

    const data = areas.map((area) => ({
      id: area.id,
      name: area.name,
      slug: area.slug,
      pincode: area.pincode,
      latitude: area.latitude,
      longitude: area.longitude,
      boundsMinLat: area.boundsMinLat,
      boundsMaxLat: area.boundsMaxLat,
      boundsMinLng: area.boundsMinLng,
      boundsMaxLng: area.boundsMaxLng,
      vendorCount: area._count.vendors,
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve areas',
        details: error?.message,
      },
    });
  }
}
