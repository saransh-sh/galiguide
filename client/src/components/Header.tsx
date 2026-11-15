import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, Compass, Menu, X, Sparkles, Globe } from 'lucide-react';
import { ActiveTab } from '../types';

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

  const handleTabClick = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-icesilver-300 shadow-street-sm transition-all">
      <div className="h-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo & Indore Street Identity */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => handleTabClick('explore')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            aria-label="GaliGuide Home"
          >
            <div className="w-10 h-10 rounded-xl bg-aubergine flex items-center justify-center text-marigold shadow-md group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 animate-[spin_16s_linear_infinite]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-black text-2xl text-aubergine tracking-tight leading-none">
                  Gali<span className="text-marigold">Guide</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-marigold-100 text-marigold-900 leading-none">
                  V2
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80 mt-0.5 flex items-center gap-1">
                <span>इन्दौर गली खोज</span>
                <span className="text-marigold">•</span>
                <span>Indore</span>
              </span>
            </div>
          </button>

          {/* Indore Iconic Street Live Indicator */}
          <div className="hidden xl:flex items-center gap-2 bg-icesilver-50 px-3 py-1.5 rounded-full border border-icesilver-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marigold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-marigold-600"></span>
            </span>
            <span className="text-xs font-semibold text-aubergine flex items-center gap-1.5">
              <span>Sarafa Night Bazaar</span>
              <span className="text-icesilver-400">|</span>
              <span className="text-on-surface-variant font-normal">Chappan Dukan</span>
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
            Explore
          </button>
          <button
            onClick={() => handleTabClick('city-map')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'city-map'
                ? 'bg-white text-aubergine shadow-street-sm'
                : 'text-on-surface-variant hover:text-aubergine hover:bg-white/60'
            }`}
          >
            City Map
          </button>
          <button
            onClick={() => handleTabClick('categories')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-white text-aubergine shadow-street-sm'
                : 'text-on-surface-variant hover:text-aubergine hover:bg-white/60'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => handleTabClick('about')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-white text-aubergine shadow-street-sm'
                : 'text-on-surface-variant hover:text-aubergine hover:bg-white/60'
            }`}
          >
            About Indore
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Bilingual Indicator Badge */}
          <div
            title="Bilingual Discovery: English + Devanagari Hindi"
            className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-aubergine bg-icesilver-100 px-2.5 py-1.5 rounded-lg border border-icesilver-300 select-none"
          >
            <Globe className="w-3.5 h-3.5 text-marigold-600" />
            <span>EN / हिन्दी</span>
          </div>

          {/* GPS Locate Me Button */}
          <button
            onClick={onLocateMe}
            title={userCoords ? 'GPS Active (Accurate within Indore)' : 'Locate My Position'}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              userCoords
                ? 'bg-marigold-50 border-marigold-300 text-marigold-900 shadow-sm'
                : 'bg-white border-icesilver-300 text-on-surface-variant hover:text-aubergine hover:border-icesilver-400'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${userCoords ? 'text-marigold-700 fill-marigold' : ''}`} />
            <span className="hidden sm:inline">
              {userCoords ? 'GPS Active' : 'Locate Me'}
            </span>
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isAdminLoggedIn
                ? 'bg-aubergine text-white border-aubergine shadow-street-sm'
                : 'bg-icesilver-100 hover:bg-icesilver-200 text-aubergine border-icesilver-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdminLoggedIn ? 'Admin Active' : 'Ward Admin'}</span>
          </button>

          {/* Discover Vendors Main CTA */}
          <button
            onClick={() => handleTabClick('city-map')}
            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-marigold text-aubergine-900 font-bold text-xs tracking-wide shadow-street-sm hover:bg-marigold-400 active:scale-95 transition-all cursor-pointer border border-marigold-600/20"
          >
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span>Map</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-icesilver-300 bg-white text-aubergine hover:bg-icesilver-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              <span>Explore Indore Streets</span>
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
              <span>Live City Map &amp; Heatmap</span>
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
              <span>Vendor Categories</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-icesilver-200 text-aubergine">
                10 Types
              </span>
            </button>
            <button
              onClick={() => handleTabClick('about')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                activeTab === 'about'
                  ? 'bg-aubergine text-white'
                  : 'text-on-surface hover:bg-icesilver-100'
              }`}
            >
              <span>About Indore Heritage</span>
              <Globe className="w-4 h-4 text-marigold-600" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
