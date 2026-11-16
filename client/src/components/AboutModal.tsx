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
                About GaliGuide &amp; Indore
              </h3>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">
                Indore Hyperlocal Civic Cartography Initiative
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
            under Swachh Survekshan—is also a vibrant culinary and commercial heart where tens of thousands of
            micro-artisans operate daily on footpaths, alleyway corners (<em>galis</em>), and mobile pushcarts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
            <div className="p-3.5 rounded-xl bg-white border border-icesilver-300 shadow-street-sm">
              <h4 className="font-display font-black text-sm text-aubergine mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-marigold-600" />
                <span>Sarafa Night Bazaar</span>
              </h4>
              <p className="text-xs text-on-surface-variant">
                Jewellery market by day, bustling street food corridor by night (8 PM to 2 AM) featuring
                flying dahi bada, bhutte ka kees, garadu, and rabdi.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-icesilver-300 shadow-street-sm">
              <h4 className="font-display font-black text-sm text-marigold-900 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-aubergine" />
                <span>Chappan Dukan (56 Shops)</span>
              </h4>
              <p className="text-xs text-on-surface-variant">
                Iconic pedestrian culinary avenue renowned for morning poha-jalebi, Johny hot dogs, khopra
                patties, and paan stalls.
              </p>
            </div>
          </div>

          <p className="text-on-surface font-medium leading-relaxed">
            Mainstream commercial apps cater exclusively to brick-and-mortar storefronts with commercial ad budgets.
            <strong className="text-aubergine"> GaliGuide</strong> uses 100% open-source cartography (OpenStreetMap &amp; Leaflet)
            to bring zero-cost digital discoverability, privacy-by-consent, and localized topological navigation to India's unsung street workforce.
          </p>

          <div className="pt-3 border-t border-icesilver-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-aubergine">
            <span>Dignity &amp; discoverability for informal micro-entrepreneurs.</span>
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
