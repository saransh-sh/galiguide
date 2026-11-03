export const Role = {
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const VendorStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const;
export type VendorStatus = (typeof VendorStatus)[keyof typeof VendorStatus];

export const OperatingStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
export type OperatingStatus = (typeof OperatingStatus)[keyof typeof OperatingStatus];

export const StallType = {
  SEMI_PERMANENT_KIOSK: 'SEMI_PERMANENT_KIOSK',
  PUSH_CART: 'PUSH_CART',
  FOOTPATH_SEAT: 'FOOTPATH_SEAT',
  ROAMING_THELA: 'ROAMING_THELA',
} as const;
export type StallType = (typeof StallType)[keyof typeof StallType];

export const DayOfWeek = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
} as const;
export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

export const AuditAction = {
  CREATE: 'CREATE',
  UPDATE_DETAILS: 'UPDATE_DETAILS',
  UPDATE_LOCATION: 'UPDATE_LOCATION',
  VERIFY: 'VERIFY',
  REJECT: 'REJECT',
  SUSPEND: 'SUSPEND',
  DELETE: 'DELETE',
} as const;
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
