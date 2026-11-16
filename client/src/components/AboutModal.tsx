import React, { useEffect } from 'react';
import { X, Award, MapPin, Heart, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aubergine-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-street-lg border border-icesilver-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-icesilver-50 border-b border-icesilver-300 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="p-2 rounded-xl bg-aubergine text-marigold shadow-street-sm flex-shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-aubergine">
                About GaliGuide • इन्दौर गली खोज
              </h3>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">
                Hyperlocal Street Discovery for Ahilya Nagari's Galis, Thelas &amp; Karigars
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-aubergine hover:bg-white active:bg-icesilver-200 rounded-xl cursor-pointer border border-transparent hover:border-icesilver-300 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center touch-action-manipulation"
            aria-label="Close about modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed bg-canvas">
          <p className="text-on-surface font-medium leading-relaxed">
            <strong className="text-aubergine">Indore</strong>—celebrated as India's cleanest city for consecutive years
            under Swachh Survekshan—is powered by tens of thousands of hardworking street vendors, thelas, and roadside
            karigars. From early morning poha-jalebi near Rajwada to midnight chaat at Sarafa, the city's living culture
            thrives on footpaths and alleyway corners (<em>galis</em>).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
            <div className="p-3.5 rounded-xl bg-white border border-icesilver-300 shadow-street-sm">
              <h4 className="font-display font-black text-sm text-aubergine mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-marigold-600" />
                <span>Sarafa Night Bazaar • सराफा बाज़ार</span>
              </h4>
              <p className="text-xs text-on-surface-variant">
                A glittering jewellery market by day that turns into an electric street-food paradise from 8 PM to 2 AM.
                Famous for Joshi ji's flying dahi bada, piping hot bhutte ka kis dusted with jeeravan, winter garadu, and malpua-rabdi.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-icesilver-300 shadow-street-sm">
              <h4 className="font-display font-black text-sm text-marigold-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-aubergine" />
                <span>Chappan Dukan • छप्पन दुकान</span>
              </h4>
              <p className="text-xs text-on-surface-variant">
                Indore's legendary 56-shop pedestrian promenade. Bustling from 6 AM for steaming Indori poha topped with
                crunchy sev, crispy jalebis, Vijay Chaat's khopra patties, Johny hot dogs, and Banarasi paan.
              </p>
            </div>
          </div>

          <p className="text-on-surface font-medium leading-relaxed">
            Mainstream commercial map apps cater exclusively to brick-and-mortar storefronts with ad budgets, leaving street stalls invisible.
            <strong className="text-aubergine"> GaliGuide</strong> uses 100% open-source cartography (OpenStreetMap &amp; Leaflet) with zero platform fees,
            partnering with Indore Municipal Ward Leads to verify physical stalls on the ground and navigate citizens using familiar street landmarks—while protecting vendor phone privacy.
          </p>

          <div className="pt-3 border-t border-icesilver-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-aubergine">
            <span>रोजी-रोटी और सम्मान: Dignity &amp; discoverability for Indore's street vendors.</span>
            <span className="flex items-center gap-1 text-marigold-800">
              <Heart className="w-3.5 h-3.5 fill-marigold text-marigold-800" />
              <span>Indore Pilot 2026</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
