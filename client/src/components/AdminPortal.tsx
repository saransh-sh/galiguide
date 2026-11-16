import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  Lock,
  LogOut,
  MapPin,
  Clock,
  Check,
  X,
  Phone,
} from 'lucide-react';
import { Vendor, Category, Area, AdminUser, OperatingHour } from '../types';
import {
  adminLogin,
  adminGetVendors,
  adminCreateVendor,
  adminUpdateVendor,
  adminVerifyVendor,
  adminDeleteVendor,
} from '../services/api';
import { CoordinatePicker } from './CoordinatePicker';
import { CategoryIcon } from '../utils/categoryIcons';
import { getCanonicalStallName } from './vendor-detail/VendorHeader';
import { Badge } from './shared/Badge';
import { Button } from './shared/Button';

interface AdminPortalProps {
  categories: Category[];
  areas: Area[];
  onClose: () => void;
  onDataModified: () => void;
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  categories,
  areas,
  onClose,
  onDataModified,
  adminUser,
  setAdminUser,
}) => {
  // Authentication Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Vendor Management Table State
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const isDirectNew = typeof window !== 'undefined' && window.location.pathname.includes('/new');
  // Modal State (Add/Edit)
  const [isFormOpen, setIsFormOpen] = useState(isDirectNew);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Verification Prompt Modal
  const [verifyTarget, setVerifyTarget] = useState<{
    vendor: Vendor;
    nextStatus: 'VERIFIED' | 'SUSPENDED';
  } | null>(null);
  const [verifyReason, setVerifyReason] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    description: '',
    contactPhone: '',
    whatsappPhone: '',
    latitude: 22.7196,
    longitude: 75.8577,
    landmark: '',
    addressLine: '',
    categoryId: categories[0]?.id || '',
    areaId: areas[0]?.id || '',
    stallType: 'PUSH_CART',
    isApproximateLoc: false,
    status: 'VERIFIED',
    isVerified: true,
    consentObtained: true,
    isPhonePublic: true,
  });

  const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([
    { dayOfWeek: 'MONDAY', openTime: '09:00', closeTime: '21:00', isClosed: false },
    { dayOfWeek: 'TUESDAY', openTime: '09:00', closeTime: '21:00', isClosed: false },
    { dayOfWeek: 'WEDNESDAY', openTime: '09:00', closeTime: '21:00', isClosed: false },
    { dayOfWeek: 'THURSDAY', openTime: '09:00', closeTime: '21:00', isClosed: false },
    { dayOfWeek: 'FRIDAY', openTime: '09:00', closeTime: '21:00', isClosed: false },
    { dayOfWeek: 'SATURDAY', openTime: '09:00', closeTime: '21:00', isClosed: false },
    { dayOfWeek: 'SUNDAY', openTime: '09:00', closeTime: '21:00', isClosed: false },
  ]);

  // Load Vendors when logged in
  const loadVendors = async () => {
    setIsLoadingVendors(true);
    try {
      const res = await adminGetVendors({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchTerm || undefined,
      });
      setVendors(res.vendors);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadVendors();
    }
  }, [adminUser, statusFilter, searchTerm]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);
    try {
      const data = await adminLogin(email, password);
      setAdminUser(data.admin);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('galiguide_admin_token');
    setAdminUser(null);
  };

  // Quick Demo Login helper
  const fillDemoCreds = (type: 'super' | 'verifier') => {
    if (type === 'super') {
      setEmail('admin@galiguide.in');
      setPassword('GaliGuide@Indore2026');
    } else {
      setEmail('verifier@galiguide.in');
      setPassword('IndoreVerifier#2026');
    }
  };

  // Open Form Modal for Create or Edit
  const openCreateModal = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      hindiName: '',
      description: '',
      contactPhone: '+91',
      whatsappPhone: '+91',
      latitude: 22.7196,
      longitude: 75.8577,
      landmark: '',
      addressLine: '',
      categoryId: categories[0]?.id || '',
      areaId: areas[0]?.id || '',
      stallType: 'PUSH_CART',
      isApproximateLoc: false,
      status: 'VERIFIED',
      isVerified: true,
      consentObtained: true,
      isPhonePublic: true,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (v: Vendor) => {
    setEditingVendor(v);
    setFormData({
      name: v.name,
      hindiName: v.hindiName || '',
      description: v.description || '',
      contactPhone: v.contactPhone || '',
      whatsappPhone: v.whatsappPhone || '',
      latitude: v.latitude,
      longitude: v.longitude,
      landmark: v.landmark,
      addressLine: v.addressLine || '',
      categoryId: v.categoryId || v.category?.id || '',
      areaId: v.areaId || v.area?.id || '',
      stallType: v.stallType || 'PUSH_CART',
      isApproximateLoc: v.isApproximateLoc ?? false,
      status: v.status,
      isVerified: v.isVerified,
      consentObtained: v.consentObtained ?? true,
      isPhonePublic: v.isPhonePublic ?? true,
    });
    if (v.operatingHours && v.operatingHours.length > 0) {
      setOperatingHours(v.operatingHours);
    }
    setIsFormOpen(true);
  };

  // Save Vendor Submit
  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        operatingHours,
      };

      if (editingVendor) {
        await adminUpdateVendor(editingVendor.id, payload);
      } else {
        await adminCreateVendor(payload);
      }

      setIsFormOpen(false);
      loadVendors();
      onDataModified();
    } catch (err: any) {
      alert(`Error saving vendor: ${err.message}`);
    }
  };

  // Handle Verification Toggle
  const handleVerificationSubmit = async () => {
    if (!verifyTarget) return;
    try {
      await adminVerifyVendor(
        verifyTarget.vendor.id,
        verifyTarget.nextStatus,
        verifyReason || 'Administrative status transition via civic verification portal.'
      );
      setVerifyTarget(null);
      setVerifyReason('');
      loadVendors();
      onDataModified();
    } catch (err: any) {
      alert(`Verification error: ${err.message}`);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    try {
      await adminDeleteVendor(id);
      loadVendors();
      onDataModified();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div
      id="admin-portal"
      data-testid="admin-portal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-aubergine-900/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
    >
      {/* Container Card */}
      <div className="relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[92vh] bg-white rounded-none sm:rounded-2xl shadow-street-lg border-0 sm:border border-icesilver-300 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-icesilver-50 border-b border-icesilver-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-aubergine flex items-center justify-center text-marigold shadow-street-sm flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-xl text-aubergine">
                Administration &amp; Verification
              </h3>
              <p className="text-[10px] sm:text-xs text-on-surface-variant font-medium">
                Indore Municipal Ward Governance System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {adminUser && (
              <button
                id="btn-admin-logout"
                data-testid="btn-admin-logout"
                onClick={handleLogout}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer border border-rose-200 touch-action-manipulation"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout ({adminUser.name || 'Admin'})</span>
                <span className="sm:hidden">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-on-surface-variant hover:text-aubergine hover:bg-white active:bg-icesilver-200 rounded-xl cursor-pointer border border-transparent hover:border-icesilver-300 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center touch-action-manipulation"
              aria-label="Close admin portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-canvas">
          {!adminUser ? (
            /* Login Screen */
            <div
              id="admin-login-modal"
              data-testid="admin-login-modal"
              className="max-w-md mx-auto py-8 bg-white p-6 sm:p-8 rounded-2xl border border-icesilver-300 shadow-street-sm"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-aubergine text-marigold flex items-center justify-center mx-auto mb-3 shadow-street-sm">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="font-display font-black text-2xl text-aubergine">
                  Ward Admin Sign In
                </h4>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">
                  Authenticate with authorized municipal ward lead or field verifier credentials
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-aubergine mb-1">
                    Email Address
                  </label>
                  <input
                    id="admin-email-input"
                    data-testid="admin-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@galiguide.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-icesilver-50 text-sm text-on-surface outline-none focus:border-marigold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-aubergine mb-1">
                    Password
                  </label>
                  <input
                    id="admin-password-input"
                    data-testid="admin-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-icesilver-50 text-sm text-on-surface outline-none focus:border-marigold focus:bg-white"
                  />
                </div>

                <Button
                  id="btn-admin-login-submit"
                  data-testid="btn-admin-login-submit"
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmittingAuth}
                  isLoading={isSubmittingAuth}
                  className="w-full"
                >
                  Sign In as Administrator
                </Button>
              </form>

              {/* Demo Fill Shortcuts */}
              <div className="mt-8 pt-6 border-t border-icesilver-200 text-center">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                  One-Tap Demo Credentials
                </span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCreds('super')}
                    className="px-3 py-1.5 bg-icesilver-50 hover:bg-marigold-50 hover:text-aubergine hover:border-marigold-300 rounded-lg text-xs font-bold text-on-surface border border-icesilver-300 cursor-pointer transition-colors"
                  >
                    Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCreds('verifier')}
                    className="px-3 py-1.5 bg-icesilver-50 hover:bg-marigold-50 hover:text-aubergine hover:border-marigold-300 rounded-lg text-xs font-bold text-on-surface border border-icesilver-300 cursor-pointer transition-colors"
                  >
                    Field Verifier
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Admin Management Dashboard */
            <div className="space-y-6">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-icesilver-300 shadow-street-sm">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">
                    Total Listings
                  </span>
                  <div className="text-2xl font-display font-black text-aubergine mt-1">
                    {vendors.length}
                  </div>
                </div>
                <div className="p-4 bg-marigold-50 rounded-xl border border-marigold-200 shadow-street-sm">
                  <span className="text-[11px] font-bold text-marigold-900 uppercase">
                    Formally Verified
                  </span>
                  <div className="text-2xl font-display font-black text-marigold-900 mt-1">
                    {vendors.filter((v) => v.status === 'VERIFIED').length}
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 shadow-street-sm">
                  <span className="text-[11px] font-bold text-amber-800 uppercase">
                    Pending Field Review
                  </span>
                  <div className="text-2xl font-display font-black text-amber-800 mt-1">
                    {vendors.filter((v) => v.status === 'PENDING').length}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-icesilver-300 shadow-street-sm">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">
                    Vendor Categories
                  </span>
                  <div className="text-2xl font-display font-black text-aubergine mt-1">
                    {categories.length}
                  </div>
                </div>
              </div>

              {/* Action and Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search & Status Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Filter by vendor name..."
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-xs font-medium text-on-surface border border-icesilver-300 outline-none focus:border-marigold"
                    />
                  </div>

                  <div className="flex items-center bg-white p-0.5 rounded-xl border border-icesilver-300 text-xs font-semibold">
                    {['ALL', 'VERIFIED', 'PENDING', 'SUSPENDED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          statusFilter === st
                            ? 'bg-aubergine text-marigold shadow-street-sm font-bold'
                            : 'text-on-surface-variant hover:text-aubergine'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Vendor Button */}
                <button
                  id="btn-add-vendor"
                  data-testid="btn-add-vendor"
                  onClick={openCreateModal}
                  className="px-4 py-2.5 bg-marigold text-aubergine-900 font-bold text-xs rounded-xl shadow-street-sm hover:bg-marigold-400 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap border border-marigold-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard New Vendor</span>
                </button>
              </div>

              {/* Vendor Registry Table */}
              <div className="border border-icesilver-300 rounded-xl overflow-hidden shadow-street-sm bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-icesilver-50 border-b border-icesilver-300 text-aubergine font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Vendor &amp; Hindi Alias</th>
                        <th className="py-3 px-3">Vendor Category</th>
                        <th className="py-3 px-3">Stall Type</th>
                        <th className="py-3 px-3">Locality</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Phone Privacy</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-icesilver-200">
                      {vendors.map((v) => (
                        <tr key={v.id} className="hover:bg-icesilver-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-aubergine">{v.name}</div>
                            {v.hindiName && (
                              <div className="text-[11px] text-on-surface-variant font-medium">
                                {v.hindiName}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="stall" size="sm">
                              <CategoryIcon iconName={v.category?.icon} size={10} />
                              <span>{v.category?.name || 'Category'}</span>
                            </Badge>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[11px] font-semibold text-aubergine">
                              {getCanonicalStallName(v.stallType)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-on-surface font-semibold">
                            {v.area?.name || 'Indore'}
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant={v.status === 'VERIFIED' ? 'verified' : v.status === 'PENDING' ? 'open' : 'closed'}
                              size="sm"
                            >
                              {v.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">
                            {v.isPhonePublic ? (
                              <span className="text-[11px] text-emerald-700 font-bold">Public</span>
                            ) : (
                              <span className="text-[11px] text-amber-800 font-bold">Masked</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Verification Toggle */}
                              <button
                                id={`btn-verify-vendor-${v.id}`}
                                data-testid={`btn-verify-vendor-${v.id}`}
                                onClick={() =>
                                  setVerifyTarget({
                                    vendor: v,
                                    nextStatus: v.status === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED',
                                  })
                                }
                                title={
                                  v.status === 'VERIFIED'
                                    ? 'Suspend listing'
                                    : 'Verify vendor listing'
                                }
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors border ${
                                  v.status === 'VERIFIED'
                                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                    : 'bg-aubergine text-marigold border-aubergine hover:bg-aubergine-600'
                                }`}
                              >
                                {v.status === 'VERIFIED' ? 'Suspend' : 'Verify'}
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => openEditModal(v)}
                                title="Edit Vendor"
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-aubergine hover:bg-icesilver-100 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete (Super admin only) */}
                              {adminUser.role === 'SUPER_ADMIN' && (
                                <button
                                  id={`btn-delete-vendor-${v.id}`}
                                  data-testid={`btn-delete-vendor-${v.id}`}
                                  onClick={() => handleDelete(v.id, v.name)}
                                  title="Delete Vendor"
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Reason Modal */}
      {verifyTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-aubergine-900/60 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-street-lg border border-icesilver-300">
            <h4 className="font-display font-black text-lg text-aubergine mb-2">
              Confirm Status Transition
            </h4>
            <p className="text-xs text-on-surface-variant mb-4">
              Transition <strong>{verifyTarget.vendor.name}</strong> to{' '}
              <span className="font-bold text-aubergine">{verifyTarget.nextStatus}</span> status. An
              immutable audit record with snapshot will be preserved in PostgreSQL.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-aubergine mb-1">
                Verification Reason / Field Observation Note:
              </label>
              <textarea
                value={verifyReason}
                onChange={(e) => setVerifyReason(e.target.value)}
                placeholder="e.g. In-person field verification conducted with Indore Ward Admin outside Gate 2."
                className="w-full p-3 rounded-xl border border-icesilver-300 bg-icesilver-50 text-xs text-on-surface outline-none focus:border-marigold h-24"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setVerifyTarget(null)}
                className="px-4 py-2 bg-icesilver-100 text-on-surface text-xs font-semibold rounded-xl hover:bg-icesilver-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerificationSubmit}
                className="px-4 py-2 bg-aubergine text-marigold text-xs font-bold rounded-xl hover:bg-aubergine-600 shadow-sm cursor-pointer"
              >
                Confirm Transition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard / Edit Vendor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-aubergine-900/60 p-0 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl h-full sm:h-auto sm:max-h-[92vh] bg-white rounded-none sm:rounded-2xl shadow-street-lg border-0 sm:border border-icesilver-300 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-icesilver-50 border-b border-icesilver-300 flex items-center justify-between">
              <h4 className="font-display font-black text-base sm:text-lg text-aubergine">
                {editingVendor ? 'Edit Street Vendor Listing' : 'Onboard New Street Vendor'}
              </h4>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-on-surface-variant hover:text-aubergine hover:bg-white active:bg-icesilver-200 rounded-xl cursor-pointer border border-transparent hover:border-icesilver-300 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center touch-action-manipulation"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveVendor} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 bg-canvas">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-aubergine mb-1">
                    Vendor Trading Name *
                  </label>
                  <input
                    id="input-vendor-name"
                    data-testid="input-vendor-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Shoe Repair"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-white text-xs text-on-surface outline-none focus:border-marigold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-aubergine mb-1">
                    Native Hindi Alias (Devanagari)
                  </label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="e.g. रमेश शू रिपेयर"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-white text-xs text-on-surface outline-none focus:border-marigold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-aubergine mb-1">
                    Vendor Category *
                  </label>
                  <select
                    id="select-vendor-category"
                    data-testid="select-vendor-category"
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-white text-xs font-semibold text-aubergine outline-none cursor-pointer focus:border-marigold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-aubergine mb-1">
                    Indore Locality / Area
                  </label>
                  <select
                    id="select-vendor-area"
                    data-testid="select-vendor-area"
                    value={formData.areaId}
                    onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-white text-xs font-semibold text-aubergine outline-none cursor-pointer focus:border-marigold"
                  >
                    <option value="">None / Custom</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-aubergine mb-1">
                    Stall Type &amp; Footprint
                  </label>
                  <select
                    id="select-vendor-stall-type"
                    data-testid="select-vendor-stall-type"
                    value={formData.stallType}
                    onChange={(e) => setFormData({ ...formData, stallType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-white text-xs font-semibold text-aubergine outline-none cursor-pointer focus:border-marigold"
                  >
                    <option value="PUSH_CART">Thela (Four-Wheeled Handcart)</option>
                    <option value="SEMI_PERMANENT_KIOSK">Gumti (Roadside Stall / Tin Kiosk)</option>
                    <option value="FOOTPATH_SEAT">Phad (Ground Cloth Setup / Sidewalk Seat)</option>
                    <option value="CYCLE_MOUNTED">Roaming Vendor (Mobile Handcart)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-aubergine">
                    <input
                      type="checkbox"
                      checked={formData.isApproximateLoc}
                      onChange={(e) =>
                        setFormData({ ...formData, isApproximateLoc: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-marigold-600 focus:ring-marigold"
                    />
                    <span>Approximate / Roaming Spot (Moves Daily)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-aubergine mb-1">
                  आस-पास का लैंडमार्क / पहचान का पता (Landmark) *
                </label>
                <input
                  id="input-vendor-landmark"
                  data-testid="input-vendor-landmark"
                  type="text"
                  required
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="उदा. हाईकोर्ट बेंच गेट नं. 2 के बाहर, पुराने बरगद के पेड़ के पास"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-white text-xs text-on-surface outline-none focus:border-marigold"
                />
              </div>

              {/* Interactive Coordinate Picker */}
              <div className="pt-2">
                <CoordinatePicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                  areas={areas}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-aubergine mb-1">
                    Contact Phone (E.164)
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+919826012345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-white text-xs text-on-surface outline-none focus:border-marigold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-aubergine mb-1">
                    WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappPhone}
                    onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                    placeholder="+919826012345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-white text-xs text-on-surface outline-none focus:border-marigold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-aubergine mb-1">
                  Stall Description &amp; History
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="दुकान/ठेले की ख़ासियत, कितने वर्षों से यहां हैं, लोकप्रिय सामान या स्वाद..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-icesilver-300 bg-white text-xs text-on-surface outline-none focus:border-marigold h-20"
                />
              </div>

              {/* Privacy and Verification Checkboxes */}
              <div className="p-4 rounded-xl bg-white border border-icesilver-300 space-y-2.5 shadow-street-sm">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-aubergine">
                  <input
                    type="checkbox"
                    checked={formData.isPhonePublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPhonePublic: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-marigold-600 focus:ring-marigold"
                  />
                  <span>Consent: Phone number can be displayed publicly for one-tap calling</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-aubergine">
                  <input
                    type="checkbox"
                    checked={formData.consentObtained}
                    onChange={(e) =>
                      setFormData({ ...formData, consentObtained: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-marigold-600 focus:ring-marigold"
                  />
                  <span>Vendor consented to civic directory discovery</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-aubergine">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isVerified: e.target.checked,
                        status: e.target.checked ? 'VERIFIED' : 'PENDING',
                      })
                    }
                    className="w-4 h-4 rounded text-marigold-600 focus:ring-marigold"
                  />
                  <span>Mark formally verified by Indore Municipal Field Team</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-icesilver-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-icesilver-100 text-on-surface text-xs font-semibold rounded-xl hover:bg-icesilver-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-vendor"
                  data-testid="btn-save-vendor"
                  type="submit"
                  className="px-6 py-2.5 bg-marigold text-aubergine-900 text-xs font-bold rounded-xl hover:bg-marigold-400 active:scale-95 shadow-street-sm cursor-pointer border border-marigold-600/30"
                >
                  {editingVendor ? 'Save Changes' : 'Publish Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
