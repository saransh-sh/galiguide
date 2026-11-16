import React, { useEffect } from 'react';
import { X, Award, Utensils, Wrench, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const { language, t } = useLanguage();

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
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-icesilver-50 border-b border-icesilver-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="p-2 rounded-xl bg-aubergine text-marigold shadow-street-sm flex-shrink-0">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-aubergine">
                {t('about.title')}
              </h3>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">
                {t('about.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-aubergine hover:bg-white active:bg-icesilver-200 rounded-xl cursor-pointer border border-transparent hover:border-icesilver-300 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center touch-action-manipulation"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed bg-canvas">
          <p className="text-on-surface text-sm sm:text-base font-medium leading-relaxed">
            {t('about.intro')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
            <div className="p-3.5 rounded-xl bg-white border border-icesilver-300 shadow-street-sm">
              <h4 className="font-display font-bold text-sm text-aubergine mb-1 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-marigold-700 flex-shrink-0" />
                <span>{t('about.card1Title')}</span>
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t('about.card1Desc')}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-icesilver-300 shadow-street-sm">
              <h4 className="font-display font-bold text-sm text-aubergine mb-1 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-aubergine flex-shrink-0" />
                <span>{t('about.card2Title')}</span>
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t('about.card2Desc')}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {t('about.body')}
          </p>

          <div className="pt-3 border-t border-icesilver-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-aubergine">
            <span>{t('about.footer')}</span>
            <span className="flex items-center gap-1 text-marigold-800">
              <ShieldCheck className="w-4 h-4 text-marigold-800" />
              <span>{t('about.badge')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
