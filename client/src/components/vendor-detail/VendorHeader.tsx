import React from 'react';
import { X, Share2, Clock, CheckCircle2 } from 'lucide-react';
import { Vendor } from '../../types';
import { CategoryIcon } from '../../utils/categoryIcons';
import { Badge } from '../shared/Badge';
import { useLanguage } from '../../context/LanguageContext';

interface VendorHeaderProps {
  vendor: Vendor;
  onClose: () => void;
  onShare: () => void;
}

export const getCanonicalStallName = (stallType?: string | null): string => {
  switch (stallType) {
    case 'SEMI_PERMANENT_KIOSK':
      return 'Gumti (Kiosk)';
    case 'FOOTPATH_SEAT':
      return 'Phad (Ground Setup)';
    case 'CYCLE_MOUNTED':
      return 'Roaming Handcart';
    case 'PUSH_CART':
    default:
      return 'Thela (Cart)';
  }
};

export const VendorHeader: React.FC<VendorHeaderProps> = ({ vendor, onClose, onShare }) => {
  const { language, t } = useLanguage();
  const isOpen = vendor.operatingHoursToday?.isOpenNow;

  const getStallName = (stallType?: string | null): string => {
    switch (stallType) {
      case 'SEMI_PERMANENT_KIOSK':
        return t('stall.gumti');
      case 'FOOTPATH_SEAT':
        return t('stall.phad');
      case 'CYCLE_MOUNTED':
        return t('stall.roaming');
      case 'PUSH_CART':
      default:
        return t('stall.thela');
    }
  };

  const primaryName = language === 'hi' ? (vendor.hindiName || vendor.name) : vendor.name;
  const secondaryName = language === 'hi'
    ? (vendor.name !== vendor.hindiName ? vendor.name : '')
    : (vendor.hindiName || '');

  const categoryName = language === 'hi'
    ? (vendor.category?.hindiName || vendor.category?.name)
    : vendor.category?.name;

  return (
    <div className="flex flex-col border-b border-icesilver-300 bg-white">
      {/* Top Bar with Badges and Controls */}
      <div className="p-4 sm:p-5 border-b border-icesilver-200 flex items-center justify-between bg-icesilver-50">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="stall" size="sm">
            <CategoryIcon iconName={vendor.category?.icon} size={14} />
            <span>{categoryName}</span>
          </Badge>

          <span className="px-2.5 py-0.5 rounded-full bg-white text-aubergine-800 text-[11px] font-bold border border-icesilver-300">
            {getStallName(vendor.stallType)}
          </span>

          {vendor.isVerified ? (
            <Badge variant="verified" size="sm">
              {t('card.verified')}
            </Badge>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              {t('card.pending')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onShare}
            title={t('drawer.shareTitle')}
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
            {primaryName}
          </h2>
          {vendor.distanceKm !== null && vendor.distanceKm !== undefined && (
            <span className="text-sm font-bold text-marigold-900 flex-shrink-0 bg-marigold-50 px-2.5 py-1 rounded-lg border border-marigold-200">
              {vendor.distanceKm < 1
                ? `${Math.round(vendor.distanceKm * 1000)} ${t('card.m')} ${t('card.away')}`
                : `${vendor.distanceKm.toFixed(1)} ${t('card.km')} ${t('card.away')}`}
            </span>
          )}
        </div>

        {secondaryName && (
          <p className="text-base text-aubergine-800 font-semibold mt-1">
            {secondaryName}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-on-surface-variant">
          <span className="font-bold text-aubergine">
            {vendor.area?.name || 'Local Ward'}
          </span>
          {vendor.area?.pincode && (
            <>
              <span>•</span>
              <span>PIN {vendor.area.pincode}</span>
            </>
          )}
          <span>•</span>
          <Badge variant={isOpen ? 'open' : 'closed'} size="sm">
            {isOpen ? t('card.openNow') : t('card.closed')}
          </Badge>
        </div>
      </div>
    </div>
  );
};
