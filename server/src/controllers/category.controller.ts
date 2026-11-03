import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { VendorStatus } from '../types/enums';

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
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

    const data = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
      vendorCount: cat._count.vendors,
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
        message: 'Failed to retrieve categories',
        details: error?.message,
      },
    });
  }
}

export async function adminGetCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { vendors: true },
        },
      },
    });

    const data = categories.map((cat) => ({
      ...cat,
      vendorCount: cat._count.vendors,
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
        message: 'Failed to retrieve admin categories',
        details: error?.message,
      },
    });
  }
}

export async function adminCreateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name, slug, description, icon, color, displayOrder = 0, isActive = true } = req.body;

    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'A category with this name or slug already exists',
        },
      });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        color,
        displayOrder,
        isActive,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create category',
        details: error?.message,
      },
    });
  }
}

export async function adminUpdateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, color, displayOrder, isActive } = req.body;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Category not found' },
      });
      return;
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(icon && { icon }),
        ...(color && { color }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update category',
        details: error?.message,
      },
    });
  }
}

export async function adminDeleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { vendors: true } } },
    });

    if (!category) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Category not found' },
      });
      return;
    }

    if (category._count.vendors > 0) {
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: `Cannot delete category with ${category._count.vendors} attached vendors`,
        },
      });
      return;
    }

    await prisma.category.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete category',
        details: error?.message,
      },
    });
  }
}
