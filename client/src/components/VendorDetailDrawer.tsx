import React, { useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { Vendor } from '../types';
import { VendorHeader } from './vendor-detail/VendorHeader';
import { VendorActions } from './vendor-detail/VendorActions';
import { LandmarkCard } from './vendor-detail/LandmarkCard';
import { OperatingScheduleTable } from './vendor-detail/OperatingScheduleTable';

interface VendorDetailDrawerProps {
  vendor: Vendor | null;
  onClose: () => void;
}

export const VendorDetailDrawer: React.FC<VendorDetailDrawerProps> = ({ vendor, onClose }) => {
  // Listen for Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!vendor) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vendor.name} — GaliGuide Indore`,
        text: `Find ${vendor.name} (${vendor.category?.name}) near ${vendor.landmark} on GaliGuide!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`
      );
      alert('Walking directions link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-aubergine-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Background dismissal backdrop */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} aria-label="Dismiss backdrop" />

      {/* Slide-over Drawer Panel */}
      <div
        id="vendor-detail-drawer"
        data-testid="vendor-detail-drawer"
        className="relative w-full max-w-lg h-full bg-white shadow-street-lg flex flex-col z-10 border-l border-icesilver-300 overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Modular Header */}
        <VendorHeader vendor={vendor} onClose={onClose} onShare={handleShare} />

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-canvas">
          {/* Primary Action Buttons (Call & Walking Directions) */}
          <VendorActions vendor={vendor} />

          {/* Topological Landmark Guidance Card */}
          <LandmarkCard vendor={vendor} />

          {/* About this Street Stall */}
          {vendor.description && (
            <div>
              <h3 className="font-display font-bold text-base text-aubergine mb-2">
                About this Street Artisan
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed bg-white p-4 rounded-xl border border-icesilver-300 shadow-street-sm">
                {vendor.description}
              </p>
            </div>
          )}

          {/* Payment & Digital Trust */}
          <div className="p-4 rounded-xl bg-white border border-icesilver-300 flex items-center justify-between shadow-street-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-marigold-100 text-aubergine flex items-center justify-center">
                <QrCode className="w-5 h-5 text-marigold-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-aubergine">Digital Payment Accepted</span>
                <span className="text-[11px] text-on-surface-variant">
                  UPI Standee QR &amp; Cash Accepted
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-aubergine text-marigold rounded-lg text-[10px] font-black uppercase tracking-wider">
              UPI Ready
            </span>
          </div>

          {/* Full 7-Day Operating Hours Table */}
          <OperatingScheduleTable vendor={vendor} />
        </div>
      </div>
    </div>
  );
};
