import React from 'react';
import { MapPin, ShieldAlert } from 'lucide-react';
import { Vendor } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface LandmarkCardProps {
  vendor: Vendor;
}

export const LandmarkCard: React.FC<LandmarkCardProps> = ({ vendor }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Moving Thela / Approximate Spot Warning Banner */}
      {vendor.isApproximateLoc && (
        <div
          data-testid="approx-location-warning"
          className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-950"
        >
          <ShieldAlert className="w-4 h-4 text-marigold-800 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-900">{t('drawer.roamingTitle')}</span>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              {t('drawer.roamingDesc')} <span className="font-bold underline">{vendor.landmark}</span>
            </p>
          </div>
        </div>
      )}

      {/* Hyperlocal Landmark Navigation Card */}
      <div className="p-4 bg-icesilver-50 rounded-2xl border border-icesilver-300 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-aubergine font-bold text-xs">
          <MapPin className="w-4 h-4 text-marigold-700 flex-shrink-0" />
          <span>{t('drawer.landmarkTitle')}</span>
        </div>
        <p data-testid="vendor-landmark" className="text-sm text-aubergine font-bold leading-relaxed">
          “{vendor.landmark}”
        </p>
        {vendor.addressLine && (
          <span className="text-xs text-on-surface-variant font-medium mt-0.5">
            {t('drawer.addressLabel')} {vendor.addressLine}
          </span>
        )}
        <div className="text-[11px] text-on-surface-variant/80 font-mono mt-1 pt-2 border-t border-icesilver-200">
          {t('drawer.gpsLabel')} {vendor.latitude.toFixed(6)}, {vendor.longitude.toFixed(6)}
        </div>
      </div>
    </div>
  );
};
