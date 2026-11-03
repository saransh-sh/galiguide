import { Router } from 'express';
import {
  getCategories,
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../controllers/category.controller';
import { getAreas } from '../controllers/area.controller';
import {
  getVendors,
  getVendorById,
  getHeatmap,
  adminGetVendors,
  adminCreateVendor,
  adminUpdateVendor,
  adminVerifyVendor,
  adminDeleteVendor,
} from '../controllers/vendor.controller';
import { login, me } from '../controllers/auth.controller';
import { authenticateAdmin, requireRole } from '../middlewares/auth';
import { Role } from '../types/enums';

const router = Router();

// =============================================================================
// PUBLIC ROUTES
// =============================================================================

// Categories
router.get('/categories', getCategories);

// Areas
router.get('/areas', getAreas);

// Vendors
router.get('/vendors/heatmap', getHeatmap);
router.get('/vendors/:id', getVendorById);
router.get('/vendors', getVendors);

// =============================================================================
// ADMIN ROUTES
// =============================================================================

// Authentication
router.post('/admin/auth/login', login);
router.get('/admin/auth/me', authenticateAdmin, me);

// Admin Category Management
router.get('/admin/categories', authenticateAdmin, adminGetCategories);
router.post('/admin/categories', authenticateAdmin, requireRole(Role.SUPER_ADMIN), adminCreateCategory);
router.put('/admin/categories/:id', authenticateAdmin, requireRole(Role.SUPER_ADMIN), adminUpdateCategory);
router.delete('/admin/categories/:id', authenticateAdmin, requireRole(Role.SUPER_ADMIN), adminDeleteCategory);

// Admin Vendor Management
router.get('/admin/vendors', authenticateAdmin, adminGetVendors);
router.post('/admin/vendors', authenticateAdmin, adminCreateVendor);
router.put('/admin/vendors/:id', authenticateAdmin, adminUpdateVendor);
router.patch('/admin/vendors/:id/verify', authenticateAdmin, adminVerifyVendor);
router.delete('/admin/vendors/:id', authenticateAdmin, requireRole(Role.SUPER_ADMIN), adminDeleteVendor);

export default router;
