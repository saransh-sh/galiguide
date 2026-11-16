import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BootScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const BootScreen: React.FC<BootScreenProps> = ({
  onComplete,
  minDurationMs = 1400,
}) => {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(15);
  const [stageIndex, setStageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  const stages = language === 'hi'
    ? [
        'गलियों का नक्शा तैयार हो रहा है...',
        'आस-पास के ठेले व कारीगर खोजे जा रहे हैं...',
        'स्थानीय डायरेक्टरी तैयार है!',
      ]
    : [
        'Mapping street alleys & waypoints...',
        'Locating nearby thelas & sidewalk artisans...',
        'Street atlas ready!',
      ];

  useEffect(() => {
    // Stage 1 -> Stage 2
    const timer1 = setTimeout(() => {
      setProgress(55);
      setStageIndex(1);
    }, minDurationMs * 0.35);

    // Stage 2 -> Stage 3
    const timer2 = setTimeout(() => {
      setProgress(90);
      setStageIndex(2);
    }, minDurationMs * 0.7);

    // Complete Progress & Trigger Exit Fade
    const timer3 = setTimeout(() => {
      setProgress(100);
      setIsExiting(true);
      if (onComplete) onComplete();
    }, minDurationMs);

    // Remove from DOM after fade animation completes
    const timer4 = setTimeout(() => {
      setIsDestroyed(true);
    }, minDurationMs + 650);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [minDurationMs, onComplete]);

  if (isDestroyed) return null;

  const handleSkip = () => {
    setIsExiting(true);
    if (onComplete) onComplete();
    setTimeout(() => setIsDestroyed(true), 400);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas select-none cursor-pointer transition-all duration-600 ease-out ${
        isExiting ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Application loading screen"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Ambient Warm Golden & Aubergine Atmosphere */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-marigold-200/35 blur-3xl pointer-events-none -top-10 -right-10 animate-pulse duration-1000" />
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-aubergine-200/20 blur-3xl pointer-events-none -bottom-10 -left-10" />

      {/* Main Centered Boot Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Brand Emblem Motif */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer Pulsing Street Radar Ring */}
          <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-marigold/60 animate-[spin_18s_linear_infinite]" />
          <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-marigold/20 animate-ping opacity-40 duration-1000" />

          {/* Official Brandmark Container */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-aubergine p-2.5 shadow-street-lg border-2 border-marigold flex items-center justify-center transform hover:scale-105 transition-transform">
            <img
              src="/assets/brand/galiguide-icon.svg"
              alt="GaliGuide Logo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* Brand Logotype Typography */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-aubergine tracking-tight">
            Gali<span className="text-marigold">Guide</span>
          </h1>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-marigold-100 text-marigold-900 border border-marigold-300">
            V2
          </span>
        </div>

        {/* Subtitle / Culture Tagline */}
        <p className="text-xs sm:text-sm font-semibold text-on-surface-variant tracking-wide mb-6">
          {language === 'hi' ? 'स्थानीय ठेले व कारीगरों की खोज' : 'Local Street Vendor & Artisan Atlas'}
        </p>

        {/* Sleek Animated Progress Bar */}
        <div className="w-56 sm:w-64 h-2 bg-icesilver-200/90 rounded-full overflow-hidden p-0.5 border border-icesilver-300 shadow-inner mb-3">
          <div
            className="h-full bg-gradient-to-r from-aubergine via-marigold to-marigold-400 rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Micro-Status Message */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-aubergine/80 font-medium min-h-[20px]">
          <Sparkles className="w-3 h-3 text-marigold-700 animate-spin duration-1000" />
          <span>{stages[stageIndex]}</span>
        </div>

        {/* Skip Hint */}
        <span className="text-[10px] text-on-surface-variant/50 mt-8 tracking-wider hover:text-aubergine transition-colors">
          {language === 'hi' ? 'छूकर सीधे खोलें • Tap anywhere to start' : 'Tap anywhere to start'}
        </span>
      </div>
    </div>
  );
};
