import React from 'react';
import { X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  iconLeft,
  onClear,
  value,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-on-surface flex items-center justify-between">
          <span>{label}</span>
        </label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <div className="absolute left-3.5 pointer-events-none text-on-surface-variant/70 flex items-center">
            {iconLeft}
          </div>
        )}
        <input
          id={inputId}
          value={value}
          className={`w-full bg-white text-on-surface placeholder:text-on-surface-variant/50 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-marigold focus:border-marigold ${
            iconLeft ? 'pl-10' : 'pl-3.5'
          } ${onClear && value ? 'pr-9' : 'pr-3.5'} py-2.5 ${
            error
              ? 'border-red-400 bg-red-50/20 focus:ring-red-300'
              : 'border-icesilver-300 hover:border-icesilver-400'
          } ${className}`}
          {...props}
        />
        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 text-on-surface-variant/60 hover:text-on-surface p-0.5 rounded-full hover:bg-icesilver-200 transition-colors cursor-pointer"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-on-surface-variant/70 mt-0.5">{helperText}</p>
      )}
    </div>
  );
};
