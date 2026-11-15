import React from 'react';
import { Phone, Navigation, ShieldAlert } from 'lucide-react';
import { Vendor } from '../../types';

interface VendorActionsProps {
  vendor: Vendor;
}

export const VendorActions: React.FC<VendorActionsProps> = ({ vendor }) => {
  const canCall = vendor.isPhonePublic && vendor.contactPhone;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}&travelmode=walking`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
      {/* Call Trigger (Native tel: URI or privacy-compliant disabled state) */}
      {canCall ? (
        <a
          id="btn-call-vendor"
          data-testid="btn-call-vendor"
          href={`tel:${vendor.contactPhone}`}
          className="px-4 py-3 bg-aubergine text-white rounded-xl font-bold text-xs tracking-wide shadow-street-sm hover:bg-aubergine-600 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
        >
          <Phone className="w-4 h-4 text-marigold" />
          <span>Call ({vendor.contactPhone})</span>
        </a>
      ) : (
        <button
          id="btn-call-vendor"
          data-testid="btn-call-vendor"
          disabled
          title="Vendor phone withheld for privacy (In-person visits only)"
          className="px-4 py-3 bg-icesilver-100 text-on-surface-variant/80 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border border-icesilver-300 text-center select-none cursor-not-allowed opacity-80"
        >
          <ShieldAlert className="w-4 h-4 text-on-surface-variant/60" />
          <span>In-Person Visit Only</span>
        </button>
      )}

      {/* Walking Directions Trigger (Zero-cost Universal Google Maps deep link) */}
      <a
        id="btn-get-directions"
        data-testid="btn-get-directions"
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-3 bg-marigold text-aubergine-900 rounded-xl font-bold text-xs tracking-wide shadow-street-sm hover:bg-marigold-400 active:bg-marigold-600 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center border border-marigold-600/30"
      >
        <Navigation className="w-4 h-4 text-aubergine" />
        <span>Get Walking Directions</span>
      </a>
    </div>
  );
};
