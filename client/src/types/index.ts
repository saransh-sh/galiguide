export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon: string;
  color: string;
  displayOrder: number;
  isActive?: boolean;
  vendorCount?: number;
}

export interface Area {
  id: string;
  name: string;
  slug: string;
  pincode?: string | null;
  latitude: number;
  longitude: number;
  boundsMinLat?: number | null;
  boundsMaxLat?: number | null;
  boundsMinLng?: number | null;
  boundsMaxLng?: number | null;
  vendorCount?: number;
}

export interface OperatingHour {
  id?: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  hindiName?: string | null;
  description?: string | null;
  contactPhone?: string | null;
  phone?: string | null;
  whatsappPhone?: string | null;
  latitude: number;
  longitude: number;
  landmark: string;
  addressLine?: string | null;
  stallType?: string | null;
  isApproximateLoc?: boolean;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  isVerified: boolean;
  isPhonePublic: boolean;
  consentObtained?: boolean;
  category: Category;
  categoryId?: string;
  area?: Area | null;
  areaId?: string | null;
  distanceKm?: number | null;
  operatingHours?: OperatingHour[];
  operatingHoursToday?: {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
    isOpenNow: boolean;
  } | null;
  navigation?: {
    googleMapsUrl: string;
    telUri?: string | null;
  };
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export type ViewMode = 'split' | 'map' | 'list';
export type ActiveTab = 'explore' | 'city-map' | 'categories' | 'about' | 'admin';
