import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'aubergine' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-marigold disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-marigold text-aubergine-900 hover:bg-marigold-400 active:bg-marigold-600 shadow-sm border border-marigold-600/20 font-bold',
    aubergine:
      'bg-aubergine text-white hover:bg-aubergine-600 active:bg-aubergine-800 shadow-street-sm',
    secondary:
      'bg-icesilver-100 text-aubergine hover:bg-icesilver-200 active:bg-icesilver-300 border border-icesilver-300',
    outline:
      'bg-transparent text-on-surface border border-icesilver-300 hover:bg-icesilver-100 active:bg-icesilver-200',
    ghost:
      'bg-transparent text-on-surface hover:bg-icesilver-100 active:bg-icesilver-200',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        iconLeft
      )}
      {children}
      {!isLoading && iconRight}
    </button>
  );
};
