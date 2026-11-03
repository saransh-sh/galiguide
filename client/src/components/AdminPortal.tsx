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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Container Card */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-on-surface">
                Civic Administration &amp; Verification Portal
              </h3>
              <p className="text-xs text-on-surface-variant">
                Indore Municipal Corporation (IMC) Street Vendor Governance System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminUser && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!adminUser ? (
            /* Login Screen */
            <div className="max-w-md mx-auto py-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="font-display font-bold text-2xl text-on-surface">
                  Administrator Sign In
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Authenticate with authorized municipal or field verifier credentials
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@galiguide.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container text-sm text-on-surface outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container text-sm text-on-surface outline-none focus:border-secondary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3 bg-secondary text-white font-bold text-xs rounded-xl shadow-md hover:bg-secondary/90 transition-all cursor-pointer"
                >
                  {isSubmittingAuth ? 'Verifying...' : 'Sign In as Administrator'}
                </button>
              </form>

              {/* Demo Fill Shortcuts */}
              <div className="mt-8 pt-6 border-t border-surface-container text-center">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                  One-Tap Demo Credentials
                </span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCreds('super')}
                    className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-on-surface border border-surface-container-high cursor-pointer"
                  >
                    Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCreds('verifier')}
                    className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-on-surface border border-surface-container-high cursor-pointer"
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
                <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">
                    Total Listings
                  </span>
                  <div className="text-2xl font-display font-bold text-on-surface mt-1">
                    {vendors.length}
                  </div>
                </div>
                <div className="p-4 bg-secondary-container/30 rounded-xl border border-secondary-container">
                  <span className="text-[11px] font-bold text-secondary uppercase">
                    Formally Verified
                  </span>
                  <div className="text-2xl font-display font-bold text-secondary mt-1">
                    {vendors.filter((v) => v.status === 'VERIFIED').length}
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-700 uppercase">
                    Pending Field Review
                  </span>
                  <div className="text-2xl font-display font-bold text-amber-800 mt-1">
                    {vendors.filter((v) => v.status === 'PENDING').length}
                  </div>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">
                    Trade Guilds
                  </span>
                  <div className="text-2xl font-display font-bold text-on-surface mt-1">
                    {categories.length}
                  </div>
                </div>
              </div>

              {/* Action and Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search & Status Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Filter by vendor name..."
                      className="w-full pl-9 pr-3 py-2 bg-surface-container rounded-xl text-xs font-medium text-on-surface border border-surface-container-high outline-none"
                    />
                  </div>

                  <div className="flex items-center bg-surface-container p-0.5 rounded-xl border border-surface-container-high text-xs font-semibold">
                    {['ALL', 'VERIFIED', 'PENDING', 'SUSPENDED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          statusFilter === st
                            ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Vendor Button */}
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard New Vendor</span>
                </button>
              </div>

              {/* Vendor Registry Table */}
              <div className="border border-surface-container-high rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface-container-low border-b border-surface-container-high text-on-surface-variant font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Vendor &amp; Hindi Alias</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Locality</th>
                        <th className="py-3 px-3">Landmark Anchor</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Phone Privacy</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {vendors.map((v) => (
                        <tr key={v.id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-on-surface">{v.name}</div>
                            {v.hindiName && (
                              <div className="text-[11px] text-on-surface-variant">
                                {v.hindiName}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
                              style={{
                                backgroundColor: `${v.category?.color || '#9d3e1c'}15`,
                                color: v.category?.color || '#9d3e1c',
                              }}
                            >
                              <CategoryIcon iconName={v.category?.icon} size={10} />
                              <span>{v.category?.name || 'Category'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-on-surface font-medium">
                            {v.area?.name || 'Indore'}
                          </td>
                          <td className="py-3 px-3 text-on-surface-variant max-w-xs truncate">
                            {v.landmark}
                          </td>
                          <td className="py-3 px-3">
                            {v.status === 'VERIFIED' ? (
                              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                                VERIFIED
                              </span>
                            ) : v.status === 'PENDING' ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                PENDING
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                                {v.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {v.isPhonePublic ? (
                              <span className="text-[11px] text-secondary font-medium">Public</span>
                            ) : (
                              <span className="text-[11px] text-amber-700 font-medium">Masked</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Verification Toggle */}
                              <button
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
                                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                  v.status === 'VERIFIED'
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    : 'bg-secondary text-white hover:bg-secondary/90'
                                }`}
                              >
                                {v.status === 'VERIFIED' ? 'Suspend' : 'Verify'}
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => openEditModal(v)}
                                title="Edit Vendor"
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete (Super admin only) */}
                              {adminUser.role === 'SUPER_ADMIN' && (
                                <button
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
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-2xl border border-surface-container-high">
            <h4 className="font-display font-bold text-lg text-on-surface mb-2">
              Confirm Status Transition
            </h4>
            <p className="text-xs text-on-surface-variant mb-4">
              Transition <strong>{verifyTarget.vendor.name}</strong> to{' '}
              <span className="font-bold text-primary">{verifyTarget.nextStatus}</span> status. An
              immutable audit record will be logged.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-on-surface mb-1">
                Verification Reason / Field Observation Note:
              </label>
              <textarea
                value={verifyReason}
                onChange={(e) => setVerifyReason(e.target.value)}
                placeholder="e.g. Field verification conducted with local ward coordinator outside Gate 2."
                className="w-full p-3 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none h-24"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setVerifyTarget(null)}
                className="px-4 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerificationSubmit}
                className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-secondary/90 shadow-md cursor-pointer"
              >
                Confirm Transition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard / Edit Vendor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
              <h4 className="font-display font-bold text-lg text-on-surface">
                {editingVendor ? 'Edit Street Vendor Listing' : 'Onboard New Street Vendor'}
              </h4>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveVendor} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Vendor Trading Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Shoe Repair"
                    className="w-full px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Native Hindi Alias (Devanagari)
                  </label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="e.g. रमेश शू रिपेयर"
                    className="w-full px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Category Guild *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Indore Locality / Area
                  </label>
                  <select
                    value={formData.areaId}
                    onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none cursor-pointer"
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
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Stall Type &amp; Footprint
                  </label>
                  <select
                    value={formData.stallType}
                    onChange={(e) => setFormData({ ...formData, stallType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none cursor-pointer"
                  >
                    <option value="PUSH_CART">Pushcart Thela (Mobile Handcart)</option>
                    <option value="SEMI_PERMANENT_KIOSK">Semi-Permanent Kiosk / Gumti</option>
                    <option value="FOOTPATH_SEAT">Footpath Seat / Takht (Sidewalk)</option>
                    <option value="ROAMING_THELA">Roaming / Wandering Hawker</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-on-surface">
                    <input
                      type="checkbox"
                      checked={formData.isApproximateLoc}
                      onChange={(e) =>
                        setFormData({ ...formData, isApproximateLoc: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Approximate / Roaming Spot (Moves Daily)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Hyperlocal Landmark Direction Anchor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g. Sidewalk outside High Court Bench Gate No. 2, under the banyan tree"
                  className="w-full px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none"
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
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Contact Phone (E.164)
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+919826012345"
                    className="w-full px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappPhone}
                    onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                    placeholder="+919826012345"
                    className="w-full px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Stall Description &amp; History
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Specialty crafts, master artisan background, years on footpath..."
                  className="w-full px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container text-xs text-on-surface outline-none h-20"
                />
              </div>

              {/* Privacy and Verification Checkboxes */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-on-surface">
                  <input
                    type="checkbox"
                    checked={formData.isPhonePublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPhonePublic: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-secondary"
                  />
                  <span>Consent: Phone number can be displayed publicly for one-tap calling</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-on-surface">
                  <input
                    type="checkbox"
                    checked={formData.consentObtained}
                    onChange={(e) =>
                      setFormData({ ...formData, consentObtained: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-secondary"
                  />
                  <span>Vendor consented to civic directory discovery</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-on-surface">
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
                    className="w-4 h-4 rounded text-secondary"
                  />
                  <span>Mark formally verified by Indore Municipal Field Team</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-high cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container shadow-md cursor-pointer"
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
