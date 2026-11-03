import React from 'react';
import {
  X,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  ShieldAlert,
  Calendar,
  Share2,
} from 'lucide-react';
import { Vendor } from '../types';
import { CategoryIcon } from '../utils/categoryIcons';

interface VendorDetailDrawerProps {
  vendor: Vendor | null;
  onClose: () => void;
}

export const VendorDetailDrawer: React.FC<VendorDetailDrawerProps> = ({ vendor, onClose }) => {
  if (!vendor) return null;

  const isOpen = vendor.operatingHoursToday?.isOpenNow;
  const canCall = vendor.isPhonePublic && vendor.contactPhone;

  // Day order for weekly table
  const daysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayNames: Record<string, string> = {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday',
  };

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
      alert('Directions link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Background dismissal backdrop */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <div
        id="vendor-detail-drawer"
        data-testid="vendor-detail-drawer"
        className="relative w-full max-w-lg h-full bg-surface-container-lowest shadow-2xl flex flex-col z-10 border-l border-surface-container-high overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/60">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
              style={{
                backgroundColor: `${vendor.category?.color || '#9d3e1c'}15`,
                color: vendor.category?.color || '#9d3e1c',
              }}
            >
              <CategoryIcon iconName={vendor.category?.icon} size={14} />
              <span>{vendor.category?.name}</span>
            </span>

            {vendor.stallType && (
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high/80 text-on-surface-variant text-[11px] font-bold">
                {vendor.stallType === 'SEMI_PERMANENT_KIOSK'
                  ? 'Semi-Permanent Kiosk'
                  : vendor.stallType === 'FOOTPATH_SEAT'
                  ? 'Footpath Seat'
                  : vendor.stallType === 'ROAMING_THELA'
                  ? 'Roaming Thela'
                  : 'Pushcart'}
              </span>
            )}

            {vendor.isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-secondary" />
                <span>Verified Artisan</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                <span>Pending Verification</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              title="Share Listing"
              className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="btn-close-drawer"
              data-testid="btn-close-drawer"
              onClick={onClose}
              className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Approximate Spot / Moving Thela Notice */}
          {vendor.isApproximateLoc && (
            <div
              data-testid="approx-location-warning"
              className="p-3.5 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-amber-950"
            >
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold">Approximate Spot / Moving Thela</span>
                <p className="mt-0.5 text-amber-900 leading-relaxed">
                  Look near landmark: <span className="font-semibold underline">{vendor.landmark}</span> (exact spot moves daily).
                </p>
              </div>
            </div>
          )}

          {/* Main Title, Hindi Script & Area */}
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-on-surface">
                {vendor.name}
              </h2>
              {vendor.distanceKm !== null && vendor.distanceKm !== undefined && (
                <span className="text-sm font-bold text-primary flex-shrink-0">
                  {vendor.distanceKm < 1
                    ? `${Math.round(vendor.distanceKm * 1000)} m away`
                    : `${vendor.distanceKm.toFixed(1)} km away`}
                </span>
              )}
            </div>

            {vendor.hindiName && (
              <p className="text-base text-on-surface-variant font-medium mt-1">
                {vendor.hindiName}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2 text-xs text-on-surface-variant">
              <span className="font-semibold text-secondary">
                {vendor.area?.name || 'Indore'}
              </span>
              {vendor.area?.pincode && (
                <>
                  <span>•</span>
                  <span>PIN {vendor.area.pincode}</span>
                </>
              )}
              <span>•</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  isOpen ? 'text-secondary' : 'text-outline'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{isOpen ? 'Open Now' : 'Closed Today'}</span>
              </span>
            </div>
          </div>

          {/* Primary Action Buttons: Call & Directions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Call Trigger (Native tel: URI) */}
            {canCall ? (
              <a
                id="btn-call-vendor"
                data-testid="btn-call-vendor"
                href={`tel:${vendor.contactPhone}`}
                className="px-4 py-3 bg-secondary text-on-secondary rounded-xl font-bold text-xs tracking-wide shadow-md hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
              >
                <Phone className="w-4 h-4" />
                <span>Call ({vendor.contactPhone})</span>
              </a>
            ) : (
              <div
                id="btn-call-disabled"
                data-testid="btn-call-disabled"
                title="Vendor contact number withheld by request"
                className="px-4 py-3 bg-surface-container text-on-surface-variant rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 border border-surface-container-high text-center select-none"
              >
                <ShieldAlert className="w-4 h-4 text-outline" />
                <span>In-Person Visit Only (No Public Phone)</span>
              </div>
            )}

            {/* Directions Trigger (Universal Google Maps walking URL) */}
            <a
              id="btn-get-directions"
              data-testid="btn-get-directions"
              href={`https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-primary text-on-primary rounded-xl font-bold text-xs tracking-wide shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Walking Directions</span>
            </a>
          </div>

          {/* Hyperlocal Landmark Navigation Card */}
          <div className="p-4 bg-primary-fixed/30 rounded-2xl border border-primary-fixed flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>Exact Hyperlocal Landmark Guide</span>
            </div>
            <p data-testid="vendor-landmark" className="text-sm text-on-surface font-semibold leading-relaxed">
              “{vendor.landmark}”
            </p>
            {vendor.addressLine && (
              <span className="text-xs text-on-surface-variant mt-1">
                Street / Area: {vendor.addressLine}
              </span>
            )}
            <div className="text-[11px] text-on-surface-variant font-mono mt-1 pt-2 border-t border-primary/10">
              Coordinates: {vendor.latitude.toFixed(6)}, {vendor.longitude.toFixed(6)}
            </div>
          </div>

          {/* Description & History */}
          {vendor.description && (
            <div>
              <h3 className="font-display font-bold text-base text-on-surface mb-2">
                About this Street Stall
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-xl border border-surface-container-high">
                {vendor.description}
              </p>
            </div>
          )}

          {/* Payment & Digital Trust */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Digital Payment Accepted</span>
                <span className="text-[11px] text-on-surface-variant">
                  UPI Standee QR &amp; Cash Accepted
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-secondary text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
              UPI Ready
            </span>
          </div>

          {/* Full 7-Day Operating Hours Table */}
          {vendor.operatingHours && vendor.operatingHours.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Weekly Schedule</span>
                </h3>
                <span className="text-[11px] text-on-surface-variant">24-hour cycle</span>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high overflow-hidden shadow-xs">
                {daysOrder.map((dayKey) => {
                  const schedule = vendor.operatingHours?.find((h) => h.dayOfWeek === dayKey);
                  const isToday = vendor.operatingHoursToday?.dayOfWeek === dayKey;

                  return (
                    <div
                      key={dayKey}
                      className={`flex items-center justify-between px-3.5 py-2 text-xs border-b border-surface-container last:border-b-0 ${
                        isToday ? 'bg-secondary-container/30 font-bold' : ''
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
                        <span className={isToday ? 'text-secondary font-bold' : 'text-on-surface'}>
                          {dayNames[dayKey]}
                        </span>
                      </span>

                      {schedule?.isClosed ? (
                        <span className="text-outline font-medium">Closed</span>
                      ) : (
                        <span className="text-on-surface-variant font-medium">
                          {schedule?.openTime} – {schedule?.closeTime}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
