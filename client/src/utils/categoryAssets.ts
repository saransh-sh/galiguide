/**
 * Category Visual Asset Resolver for GaliGuide V2
 * Provides local vector illustrations for all 10 informal vendor categories.
 */

const CATEGORY_ASSET_MAP: Record<string, string> = {
  'street-food': '/assets/categories/street-food.svg',
  'chai-beverages': '/assets/categories/chai-beverages.svg',
  'cobbler': '/assets/categories/cobbler.svg',
  'key-maker': '/assets/categories/key-maker.svg',
  'knife-sharpener': '/assets/categories/knife-sharpener.svg',
  'fruits-vegetables': '/assets/categories/fruits-vegetables.svg',
  'tailor-alteration': '/assets/categories/tailor-alteration.svg',
  'flower-vendor': '/assets/categories/flower-vendor.svg',
  'cycle-repair': '/assets/categories/cycle-repair.svg',
  'pottery-artisan': '/assets/categories/pottery-artisan.svg',
};

export function getCategoryAsset(slug?: string): string {
  if (!slug) return '/assets/categories/street-food.svg';
  return CATEGORY_ASSET_MAP[slug.toLowerCase()] || '/assets/categories/street-food.svg';
}

export const HERO_ASSET = '/assets/hero/hero_indore_street.svg';
export const EMPTY_STATE_NO_VENDORS = '/assets/empty-states/no-vendors.svg';
export const EMPTY_STATE_GPS_DENIED = '/assets/empty-states/gps-denied.svg';
