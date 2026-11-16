import React from 'react';
import { ChevronDown, MapPin, CheckCircle2 } from 'lucide-react';
import { Vendor } from '../types';
import { Badge } from './shared/Badge';
import { CategoryIcon } from '../utils/categoryIcons';

interface MobileMapSheetProps {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  onSelectVendor: (vendor: Vendor) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMapSheet: React.FC<MobileMapSheetProps> = ({
  vendors,
  selectedVendor,
  onSelectVendor,
  isOpen,
  onToggle,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="md:hidden fixed left-0 right-0 bottom-14 sm:bottom-16 z-40 bg-white rounded-t-3xl shadow-street-lg border-t border-icesilver-300 transition-all duration-300 ease-in-out flex flex-col h-[70dvh] max-h-[580px] animate-in slide-in-from-bottom"
    >
      {/* Drag handle & Summary Header */}
      <div
        onClick={onToggle}
        className="px-4 py-3 flex flex-col items-center cursor-pointer select-none border-b border-icesilver-200 touch-action-manipulation bg-icesilver-50/60 rounded-t-3xl"
      >
        <div className="w-12 h-1.5 bg-icesilver-400 rounded-full mb-2" />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-aubergine">
              {vendors.length} {vendors.length === 1 ? 'Thela/Vendor' : 'Thele/Vendors'}
            </span>
            <Badge variant="stall" size="sm">
              इंदौर की गलियां
            </Badge>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-aubergine min-w-[36px] min-h-[36px] flex items-center justify-center touch-action-manipulation"
            aria-label="Collapse sheet"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Vendor List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-canvas">
        {vendors.length === 0 ? (
          <div className="p-6 text-center text-on-surface-variant text-xs">
            इस फ़िल्टर में कोई वेंडर नहीं मिला। कृपया श्रेणी या इलाका बदलें।
          </div>
        ) : (
          vendors.map((vendor) => {
            const isSelected = selectedVendor?.id === vendor.id;
            const isOpenNow = vendor.operatingHoursToday?.isOpenNow;

            return (
              <div
                key={vendor.id}
                onClick={() => {
                  onSelectVendor(vendor);
                  onToggle();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white touch-action-manipulation ${
                  isSelected
                    ? 'border-aubergine shadow-street-md ring-2 ring-aubergine/20'
                    : 'border-icesilver-300 active:border-marigold'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="stall" size="sm">
                    <CategoryIcon iconName={vendor.category?.icon} size={12} />
                    <span>{vendor.category?.name}</span>
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {vendor.isVerified && (
                      <Badge variant="verified" size="sm">
                        Verified
                      </Badge>
                    )}
                    <Badge variant={isOpenNow ? 'open' : 'closed'} size="sm">
                      {isOpenNow ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <h4 className="font-display font-bold text-sm text-aubergine">
                    {vendor.name}
                  </h4>
                  {vendor.distanceKm !== null && vendor.distanceKm !== undefined && (
                    <span className="text-xs font-bold text-marigold-800 flex-shrink-0">
                      {vendor.distanceKm < 1
                        ? `${Math.round(vendor.distanceKm * 1000)} m`
                        : `${vendor.distanceKm.toFixed(1)} km`}
                    </span>
                  )}
                </div>

                {vendor.hindiName && (
                  <span className="text-xs text-on-surface-variant block mt-0.5">
                    {vendor.hindiName}
                  </span>
                )}

                <p className="text-xs text-on-surface-variant line-clamp-1 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-aubergine flex-shrink-0" />
                  <span className="truncate">{vendor.landmark}</span>
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
