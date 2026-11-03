import { Category, Area, Vendor, AdminUser } from '../types';

const BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('galiguide_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to fetch categories');
  return json.data;
}

export async function fetchAreas(): Promise<Area[]> {
  const res = await fetch(`${BASE_URL}/areas`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to fetch areas');
  return json.data;
}

export interface FetchVendorsParams {
  category?: string;
  categoryId?: string;
  areaId?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
  sortBy?: 'distance' | 'name' | 'createdAt';
  status?: string;
}

export async function fetchVendors(params: FetchVendorsParams = {}): Promise<{
  vendors: Vendor[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  if (params.categoryId) query.append('categoryId', params.categoryId);
  if (params.areaId) query.append('areaId', params.areaId);
  if (params.search) query.append('search', params.search);
  if (params.lat !== undefined) query.append('lat', params.lat.toString());
  if (params.lng !== undefined) query.append('lng', params.lng.toString());
  if (params.radiusKm !== undefined) query.append('radiusKm', params.radiusKm.toString());
  if (params.page !== undefined) query.append('page', params.page.toString());
  if (params.limit !== undefined) query.append('limit', params.limit.toString());
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.status) query.append('status', params.status);

  const res = await fetch(`${BASE_URL}/vendors?${query.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to fetch vendors');
  return {
    vendors: json.data,
    meta: json.meta || { totalCount: json.data.length, page: 1, limit: json.data.length, totalPages: 1 },
  };
}

export async function fetchVendorById(id: string): Promise<Vendor> {
  const res = await fetch(`${BASE_URL}/vendors/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to fetch vendor');
  return json.data;
}

export async function fetchHeatmap(categoryId?: string): Promise<[number, number, number][]> {
  const query = categoryId ? `?categoryId=${categoryId}` : '';
  const res = await fetch(`${BASE_URL}/vendors/heatmap${query}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to fetch heatmap');
  return json.data;
}

// -----------------------------------------------------------------------------
// Admin API Methods
// -----------------------------------------------------------------------------

export async function adminLogin(
  email: string,
  password: string
): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch(`${BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Invalid email or password');
  localStorage.setItem('galiguide_admin_token', json.data.token);
  return json.data;
}

export async function adminGetMe(): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/admin/auth/me`, {
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Session expired');
  return json.data;
}

export async function adminGetVendors(params: {
  status?: string;
  search?: string;
  categoryId?: string;
  areaId?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ vendors: Vendor[]; totalCount: number }> {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.search) query.append('search', params.search);
  if (params.categoryId) query.append('categoryId', params.categoryId);
  if (params.areaId) query.append('areaId', params.areaId);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());

  const res = await fetch(`${BASE_URL}/admin/vendors?${query.toString()}`, {
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to fetch admin vendors');
  return {
    vendors: json.data,
    totalCount: json.meta?.totalCount || json.data.length,
  };
}

export async function adminCreateVendor(vendorData: any): Promise<Vendor> {
  const res = await fetch(`${BASE_URL}/admin/vendors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(vendorData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to create vendor');
  return json.data;
}

export async function adminUpdateVendor(id: string, vendorData: any): Promise<Vendor> {
  const res = await fetch(`${BASE_URL}/admin/vendors/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(vendorData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to update vendor');
  return json.data;
}

export async function adminVerifyVendor(
  id: string,
  status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED',
  reason: string
): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/vendors/${id}/verify`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status, reason }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to update vendor verification');
  return json.data;
}

export async function adminDeleteVendor(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/vendors/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Failed to delete vendor');
}
