import React from 'react';
import { Flame, X } from 'lucide-react';

interface HeatmapLegendProps {
  onClose?: () => void;
}

export const HeatmapLegend: React.FC<HeatmapLegendProps> = ({ onClose }) => {
  return (
    <div
      id="heatmap-legend"
      data-testid="heatmap-legend"
      className="absolute bottom-6 right-4 z-[400] bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-street-md border border-icesilver-300 text-xs max-w-xs animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-aubergine">
          <Flame className="w-4 h-4 text-marigold-600 fill-marigold" />
          <span>Vendor Density</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-aubergine p-0.5 rounded cursor-pointer"
            aria-label="Hide legend"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="heatmap-legend-bar w-full mb-1.5" />

      <div className="flex justify-between items-center text-[10px] font-semibold text-on-surface-variant">
        <span>Sparse</span>
        <span className="text-marigold-800">Cluster</span>
        <span className="text-aubergine font-bold">Dense (Sarafa)</span>
      </div>
    </div>
  );
};
