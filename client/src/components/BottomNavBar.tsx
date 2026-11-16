import React from 'react';
import { Compass, MapPin, Layers, Award, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-icesilver-300 shadow-street-lg px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {/* Tab 1: Explore */}
        <button
          onClick={() => onTabChange('explore')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] touch-action-manipulation cursor-pointer ${
            activeTab === 'explore'
              ? 'text-aubergine bg-marigold-50/80 font-bold'
              : 'text-on-surface-variant hover:text-aubergine active:bg-icesilver-100 font-medium'
          }`}
          aria-label={t('nav.explore')}
        >
          <Compass
            className={`w-5 h-5 mb-0.5 transition-transform ${
              activeTab === 'explore' ? 'text-aubergine scale-110' : 'text-on-surface-variant'
            }`}
          />
          <span className="text-[10px] tracking-tight leading-none">{t('nav.explore')}</span>
        </button>

        {/* Tab 2: City Map */}
        <button
          onClick={() => onTabChange('city-map')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] touch-action-manipulation cursor-pointer ${
            activeTab === 'city-map'
              ? 'text-aubergine bg-marigold-50/80 font-bold'
              : 'text-on-surface-variant hover:text-aubergine active:bg-icesilver-100 font-medium'
          }`}
          aria-label={t('nav.map')}
        >
          <div className="relative">
            <MapPin
              className={`w-5 h-5 mb-0.5 transition-transform ${
                activeTab === 'city-map' ? 'text-aubergine scale-110' : 'text-on-surface-variant'
              }`}
            />
            {activeTab === 'city-map' && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-marigold border border-white" />
            )}
          </div>
          <span className="text-[10px] tracking-tight leading-none">{t('nav.map')}</span>
        </button>

        {/* Tab 3: Categories */}
        <button
          onClick={() => onTabChange('categories')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] touch-action-manipulation cursor-pointer ${
            activeTab === 'categories'
              ? 'text-aubergine bg-marigold-50/80 font-bold'
              : 'text-on-surface-variant hover:text-aubergine active:bg-icesilver-100 font-medium'
          }`}
          aria-label={t('nav.categories')}
        >
          <Layers
            className={`w-5 h-5 mb-0.5 transition-transform ${
              activeTab === 'categories' ? 'text-aubergine scale-110' : 'text-on-surface-variant'
            }`}
          />
          <span className="text-[10px] tracking-tight leading-none">{t('nav.categories')}</span>
        </button>

        {/* Tab 4: About */}
        <button
          onClick={() => onTabChange('about')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] touch-action-manipulation cursor-pointer ${
            activeTab === 'about'
              ? 'text-aubergine bg-marigold-50/80 font-bold'
              : 'text-on-surface-variant hover:text-aubergine active:bg-icesilver-100 font-medium'
          }`}
          aria-label={t('nav.about')}
        >
          <Award
            className={`w-5 h-5 mb-0.5 transition-transform ${
              activeTab === 'about' ? 'text-aubergine scale-110' : 'text-on-surface-variant'
            }`}
          />
          <span className="text-[10px] tracking-tight leading-none">{t('nav.about')}</span>
        </button>

        {/* Tab 5: Ward Admin */}
        <button
          onClick={onOpenAdmin}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] touch-action-manipulation cursor-pointer ${
            isAdminLoggedIn
              ? 'text-aubergine font-bold bg-marigold-100'
              : 'text-on-surface-variant hover:text-aubergine active:bg-icesilver-100 font-medium'
          }`}
          aria-label={isAdminLoggedIn ? t('nav.admin') : t('nav.login')}
        >
          <div className="relative">
            <ShieldCheck
              className={`w-5 h-5 mb-0.5 ${
                isAdminLoggedIn ? 'text-aubergine fill-marigold' : 'text-on-surface-variant'
              }`}
            />
            {isAdminLoggedIn && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            )}
          </div>
          <span className="text-[10px] tracking-tight leading-none">
            {isAdminLoggedIn ? t('nav.admin') : t('nav.login')}
          </span>
        </button>
      </div>
    </nav>
  );
};
