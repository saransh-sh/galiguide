import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, Compass, Menu, X, Sparkles, Globe } from 'lucide-react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onLocateMe: () => void;
  userCoords: { lat: number; lng: number } | null;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onLocateMe,
  userCoords,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const handleTabClick = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-icesilver-300 shadow-street-sm transition-all">
      <div className="h-14 sm:h-16 md:h-18 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Logo & Street Identity */}
        <div className="flex items-center gap-2 sm:gap-6">
          <button
            onClick={() => handleTabClick('explore')}
            className="flex items-center gap-2 sm:gap-2.5 group text-left cursor-pointer focus:outline-none touch-action-manipulation"
            aria-label="GaliGuide Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-aubergine p-1 shadow-md group-hover:scale-105 transition-transform duration-200 flex-shrink-0 border border-marigold/30 flex items-center justify-center">
              <img src="/assets/brand/galiguide-icon.svg" alt="GaliGuide Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-black text-xl sm:text-2xl text-aubergine tracking-tight leading-none">
                  Gali<span className="text-marigold">Guide</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded bg-marigold-100 text-marigold-900 leading-none">
                  V2
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-on-surface-variant/80 mt-0.5 flex items-center gap-1">
                <span>{t('brand.subtitle')}</span>
              </span>
            </div>
          </button>

          {/* Quick Street Indicators */}
          <div className="hidden xl:flex items-center gap-2 bg-icesilver-50 px-3 py-1.5 rounded-full border border-icesilver-300 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marigold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-marigold-600"></span>
            </span>
            <span className="font-semibold text-aubergine flex items-center gap-1.5">
              <span>{t('header.streetFood')}</span>
              <span className="text-icesilver-400">•</span>
              <span>{t('header.repairArtisans')}</span>
              <span className="text-icesilver-400">•</span>
              <span>{t('header.localMarkets')}</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-icesilver-100/80 p-1 rounded-xl border border-icesilver-300">
          <button
            onClick={() => handleTabClick('explore')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-white text-aubergine shadow-street-sm'
                : 'text-on-surface-variant hover:text-aubergine hover:bg-white/60'
            }`}
          >
            {t('header.explore')}
          </button>
          <button
            onClick={() => handleTabClick('city-map')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'city-map'
                ? 'bg-white text-aubergine shadow-street-sm'
                : 'text-on-surface-variant hover:text-aubergine hover:bg-white/60'
            }`}
          >
            {t('header.map')}
          </button>
          <button
            onClick={() => handleTabClick('categories')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-white text-aubergine shadow-street-sm'
                : 'text-on-surface-variant hover:text-aubergine hover:bg-white/60'
            }`}
          >
            {t('header.categories')}
          </button>
          <button
            onClick={() => handleTabClick('about')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-white text-aubergine shadow-street-sm'
                : 'text-on-surface-variant hover:text-aubergine hover:bg-white/60'
            }`}
          >
            {t('header.about')}
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Interactive Language Switcher Toggle (EN / हिन्दी) */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'हिन्दी में बदलें (Switch to Hindi)' : 'Switch to English (अंग्रेज़ी में बदलें)'}
            className="flex items-center gap-1 text-xs font-bold text-aubergine bg-icesilver-100 hover:bg-marigold-50 active:bg-marigold-100 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-icesilver-300 hover:border-marigold-400 transition-all cursor-pointer min-h-[38px] touch-action-manipulation select-none"
            aria-label="Toggle language between English and Hindi"
          >
            <Globe className="w-3.5 h-3.5 text-marigold-700 flex-shrink-0" />
            <span className={language === 'en' ? 'text-aubergine font-black underline decoration-marigold decoration-2 underline-offset-2' : 'text-on-surface-variant font-medium'}>
              EN
            </span>
            <span className="text-icesilver-400 font-normal">/</span>
            <span className={language === 'hi' ? 'text-aubergine font-black underline decoration-marigold decoration-2 underline-offset-2' : 'text-on-surface-variant font-medium'}>
              हिन्दी
            </span>
          </button>

          {/* GPS Locate Me Button */}
          <button
            onClick={onLocateMe}
            title={userCoords ? t('header.gpsActive') : t('header.locateMe')}
            className={`min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 px-2.5 py-2 sm:px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-action-manipulation ${
              userCoords
                ? 'bg-marigold-50 border-marigold-300 text-marigold-900 shadow-sm'
                : 'bg-white border-icesilver-300 text-on-surface-variant hover:text-aubergine hover:border-icesilver-400 active:bg-icesilver-100'
            }`}
            aria-label={userCoords ? t('header.gpsActive') : t('header.locateMe')}
          >
            <Navigation className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${userCoords ? 'text-marigold-700 fill-marigold' : ''}`} />
            <span className="hidden md:inline">
              {userCoords ? t('header.gpsActive') : t('header.locateMe')}
            </span>
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? t('header.adminActive') : t('header.admin')}
            className={`min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 px-2.5 py-2 sm:px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border touch-action-manipulation ${
              isAdminLoggedIn
                ? 'bg-aubergine text-white border-aubergine shadow-street-sm'
                : 'bg-icesilver-100 hover:bg-icesilver-200 active:bg-icesilver-300 text-aubergine border-icesilver-300'
            }`}
            aria-label={isAdminLoggedIn ? t('header.adminActive') : t('header.admin')}
          >
            <ShieldCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden md:inline">{isAdminLoggedIn ? t('header.adminActive') : t('header.admin')}</span>
          </button>

          {/* Discover Vendors Main CTA (Desktop & Tablet) */}
          <button
            onClick={() => handleTabClick('city-map')}
            className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl bg-marigold text-aubergine-900 font-bold text-xs tracking-wide shadow-street-sm hover:bg-marigold-400 active:scale-95 transition-all cursor-pointer border border-marigold-600/20 touch-action-manipulation"
          >
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span>{t('header.map')}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[38px] min-h-[38px] p-2 rounded-xl border border-icesilver-300 bg-white text-aubergine hover:bg-icesilver-100 active:bg-icesilver-200 transition-colors cursor-pointer flex items-center justify-center touch-action-manipulation"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (360px - 768px viewports) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-icesilver-300 px-4 py-3 shadow-street-md animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleTabClick('explore')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                activeTab === 'explore'
                  ? 'bg-aubergine text-white'
                  : 'text-on-surface hover:bg-icesilver-100'
              }`}
            >
              <span>{t('header.explore')}</span>
              <Sparkles className="w-4 h-4 text-marigold" />
            </button>
            <button
              onClick={() => handleTabClick('city-map')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                activeTab === 'city-map'
                  ? 'bg-aubergine text-white'
                  : 'text-on-surface hover:bg-icesilver-100'
              }`}
            >
              <span>{t('header.map')}</span>
              <MapPin className="w-4 h-4 text-marigold" />
            </button>
            <button
              onClick={() => handleTabClick('categories')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                activeTab === 'categories'
                  ? 'bg-aubergine text-white'
                  : 'text-on-surface hover:bg-icesilver-100'
              }`}
            >
              <span>{t('header.categories')}</span>
            </button>
            <button
              onClick={() => handleTabClick('about')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                activeTab === 'about'
                  ? 'bg-aubergine text-white'
                  : 'text-on-surface hover:bg-icesilver-100'
              }`}
            >
              <span>{t('header.about')}</span>
              <Globe className="w-4 h-4 text-marigold-600" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
