import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MapPin, CheckCircle2, ChevronRight, Phone } from 'lucide-react';
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
  return (
    <div
      className={`md:hidden fixed left-0 right-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-street-lg border-t border-icesilver-300 transition-all duration-300 ease-in-out flex flex-col ${
        isOpen ? 'h-[75vh]' : 'h-20'
      }`}
    >
      {/* Drag handle & Summary Header */}
      <div
        onClick={onToggle}
        className="px-4 py-2.5 flex flex-col items-center cursor-pointer select-none border-b border-icesilver-200"
      >
        <div className="w-10 h-1.5 bg-icesilver-300 rounded-full mb-1.5" />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-aubergine">
              {vendors.length} {vendors.length === 1 ? 'Vendor' : 'Vendors'} Mapped
            </span>
            <Badge variant="stall" size="sm">
              Indore Streets
            </Badge>
          </div>
          <button
            className="p-1 rounded-full text-on-surface-variant hover:text-aubergine"
            aria-label={isOpen ? 'Collapse sheet' : 'Expand sheet'}
          >
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Vendor List */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-canvas">
          {vendors.map((vendor) => {
            const isSelected = selectedVendor?.id === vendor.id;
            const isOpenNow = vendor.operatingHoursToday?.isOpenNow;

            return (
              <div
                key={vendor.id}
                onClick={() => onSelectVendor(vendor)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-aubergine shadow-street-md ring-2 ring-aubergine/20'
                    : 'border-icesilver-300 hover:border-marigold'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="stall" size="sm">
                    {vendor.category?.name}
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
                    <span className="text-xs font-bold text-marigold-800">
                      {vendor.distanceKm < 1
                        ? `${Math.round(vendor.distanceKm * 1000)} m`
                        : `${vendor.distanceKm.toFixed(1)} km`}
                    </span>
                  )}
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-1 mt-1">
                  {vendor.landmark}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
