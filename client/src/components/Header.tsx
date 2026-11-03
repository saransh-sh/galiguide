import React from 'react';
import { MapPin, Navigation, ShieldCheck, Compass } from 'lucide-react';
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
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Indore City Tag */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => onTabChange('explore')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/30 group-hover:bg-primary-container transition-all">
              <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl text-on-surface tracking-tight leading-none">
                Gali<span className="text-primary font-bold">Guide</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mt-0.5">
                Indore Streets
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center gap-2 bg-surface-container px-3.5 py-1.5 rounded-full border border-surface-container-high">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
              <span>Indore</span>
              <span className="text-on-surface-variant">•</span>
              <span className="text-primary">Sarafa &amp; Chhappan</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container/60 p-1 rounded-xl border border-surface-container-high/40">
          <button
            onClick={() => onTabChange('explore')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onTabChange('city-map')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'city-map'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
            }`}
          >
            City Map
          </button>
          <button
            onClick={() => onTabChange('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => onTabChange('about')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
            }`}
          >
            About Indore
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GPS Locate Me Button */}
          <button
            onClick={onLocateMe}
            title={userCoords ? 'GPS Active' : 'Locate on Map'}
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
              userCoords
                ? 'bg-secondary-container/40 border-secondary text-secondary'
                : 'bg-surface-container border-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Navigation className={`w-4 h-4 ${userCoords ? 'text-secondary fill-secondary' : ''}`} />
            <span className="hidden sm:inline">
              {userCoords ? 'GPS Active' : 'My Location'}
            </span>
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAdminLoggedIn
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-secondary-container/60 hover:bg-secondary-container text-on-secondary-container'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin Portal'}</span>
          </button>

          {/* Discover Vendors Main CTA */}
          <button
            onClick={() => onTabChange('city-map')}
            className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-xs tracking-wide shadow-[0_2px_8px_rgba(157,62,28,0.25)] hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            <span>Discover Vendors</span>
          </button>
        </div>
      </div>
    </header>
  );
};
