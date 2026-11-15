import React from 'react';
import { CheckCircle2, Clock, MapPin } from 'lucide-react';

export interface BadgeProps {
  variant?: 'verified' | 'open' | 'closed' | 'stall' | 'default' | 'marigold';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantClasses = {
    verified: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold',
    open: 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold',
    closed: 'bg-gray-100 text-gray-700 border border-gray-300 font-medium',
    stall: 'bg-aubergine-50 text-aubergine-800 border border-aubergine-200 font-semibold',
    marigold: 'bg-marigold-50 text-marigold-900 border border-marigold-300 font-bold',
    default: 'bg-icesilver-100 text-on-surface-variant border border-icesilver-300 font-medium',
  };

  const getIcon = () => {
    switch (variant) {
      case 'verified':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'open':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'stall':
        return <MapPin className="w-3.5 h-3.5 text-aubergine" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {getIcon()}
      {children}
    </span>
  );
};
