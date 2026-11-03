import React from 'react';
import { X, Award, MapPin, Heart, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden">
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary text-white">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="font-display font-bold text-xl text-on-surface">
              About GaliGuide &amp; Indore's Street Heritage
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          <p>
            <strong>Indore</strong>—celebrated as India's cleanest city for consecutive years under Swachh
            Survekshan—is also a bustling commercial and culinary capital where tens of thousands of
            micro-artisans operate daily on footpaths, alleyway corners (<em>galis</em>), and mobile pushcarts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
            <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high">
              <h4 className="font-display font-bold text-sm text-primary mb-1">
                Sarafa Night Bazaar
              </h4>
              <p className="text-xs">
                Jewellery market by day, bustling street food corridor by night (8 PM to 2 AM) featuring
                flying dahi bada, bhutte ka kees, garadu, and rabdi.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high">
              <h4 className="font-display font-bold text-secondary mb-1">
                Chappan Dukan (56 Shops)
              </h4>
              <p className="text-xs">
                Iconic pedestrian culinary avenue renowned for morning poha-jalebi, Johny hot dogs, khopra
                patties, and paan stalls.
              </p>
            </div>
          </div>

          <p>
            Mainstream commercial apps (Google Maps, Zomato) cater exclusively to formal shops with trade
            licenses and commercial ad budgets. <strong>GaliGuide</strong> uses 100% free open-source
            mapping (OpenStreetMap &amp; Leaflet) to bring zero-cost digital discoverability, dignified visibility,
            and localized topological navigation to India's unsung street workforce.
          </p>

          <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs font-semibold text-secondary">
            <span>Built with respect for Indore's street micro-entrepreneurs.</span>
            <span className="flex items-center gap-1 text-primary">
              <Heart className="w-3.5 h-3.5 fill-primary" />
              <span>Indore Pilot 2026</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
