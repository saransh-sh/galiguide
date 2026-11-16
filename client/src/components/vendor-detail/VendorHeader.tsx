import React from 'react';
import { X, Share2, Clock, CheckCircle2 } from 'lucide-react';
import { Vendor } from '../../types';
import { CategoryIcon } from '../../utils/categoryIcons';
import { Badge } from '../shared/Badge';

interface VendorHeaderProps {
  vendor: Vendor;
  onClose: () => void;
  onShare: () => void;
}

export const getCanonicalStallName = (stallType?: string | null): string => {
  switch (stallType) {
    case 'SEMI_PERMANENT_KIOSK':
      return 'Gumti (Roadside Stall)';
    case 'FOOTPATH_SEAT':
      return 'Phad (Ground Setup)';
    case 'CYCLE_MOUNTED':
      return 'Roaming Vendor (Mobile Handcart)';
    case 'PUSH_CART':
    default:
      return 'Thela (Handcart)';
  }
};

export const VendorHeader: React.FC<VendorHeaderProps> = ({ vendor, onClose, onShare }) => {
  const isOpen = vendor.operatingHoursToday?.isOpenNow;

  return (
    <div className="flex flex-col border-b border-icesilver-300 bg-white">
      {/* Top Bar with Badges and Controls */}
      <div className="p-4 sm:p-5 border-b border-icesilver-200 flex items-center justify-between bg-icesilver-50">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="stall" size="sm">
            <CategoryIcon iconName={vendor.category?.icon} size={14} />
            <span>{vendor.category?.name}</span>
          </Badge>

          <span className="px-2.5 py-0.5 rounded-full bg-white text-aubergine-800 text-[11px] font-bold border border-icesilver-300">
            {getCanonicalStallName(vendor.stallType)}
          </span>

          {vendor.isVerified ? (
            <Badge variant="verified" size="sm">
              Verified Artisan
            </Badge>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              Pending Verification
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onShare}
            title="Share Listing"
            className="p-2 rounded-xl text-on-surface-variant hover:text-aubergine hover:bg-white active:bg-icesilver-200 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center touch-action-manipulation"
            aria-label="Share listing"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            id="btn-close-drawer"
            data-testid="btn-close-drawer"
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:text-aubergine hover:bg-white active:bg-icesilver-200 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center touch-action-manipulation"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Vendor Title Header */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-aubergine">
            {vendor.name}
          </h2>
          {vendor.distanceKm !== null && vendor.distanceKm !== undefined && (
            <span className="text-sm font-bold text-marigold-900 flex-shrink-0 bg-marigold-50 px-2.5 py-1 rounded-lg border border-marigold-200">
              {vendor.distanceKm < 1
                ? `${Math.round(vendor.distanceKm * 1000)} m away`
                : `${vendor.distanceKm.toFixed(1)} km away`}
            </span>
          )}
        </div>

        {vendor.hindiName && (
          <p className="text-base text-aubergine-800 font-semibold mt-1">
            {vendor.hindiName}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-on-surface-variant">
          <span className="font-bold text-aubergine">
            {vendor.area?.name || 'Indore'}
          </span>
          {vendor.area?.pincode && (
            <>
              <span>•</span>
              <span>PIN {vendor.area.pincode}</span>
            </>
          )}
          <span>•</span>
          <Badge variant={isOpen ? 'open' : 'closed'} size="sm">
            {isOpen ? 'Open Now' : 'Closed Today'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
