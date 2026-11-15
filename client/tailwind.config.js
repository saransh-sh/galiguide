/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // GaliGuide V2 Contemporary Street Culture Tokens
        aubergine: {
          DEFAULT: '#3A0F34',
          50: '#F9F4F8',
          100: '#F0E5EE',
          200: '#DEC6DC',
          300: '#C59FC2',
          400: '#9B5B96',
          500: '#6C2D66',
          600: '#4D1847',
          700: '#3A0F34', // Canonical Deep Aubergine
          800: '#290A24',
          900: '#1A0517',
        },
        marigold: {
          DEFAULT: '#EAAA00',
          50: '#FFFBEA',
          100: '#FFF6C5',
          200: '#FFED8B',
          300: '#FFE04B',
          400: '#F5C40A',
          500: '#EAAA00', // Canonical Marigold
          600: '#C78C00',
          700: '#9C6B00',
          800: '#734E00',
          900: '#4F3400',
        },
        icesilver: {
          DEFAULT: '#DDE3E8',
          50: '#F8F9FA',
          100: '#EEF2F5',
          200: '#DDE3E8', // Canonical Ice Silver
          300: '#CDD4DB', // Canonical Border
          400: '#A9B4BF',
          500: '#8794A2',
          600: '#677482',
          700: '#4D5864',
          800: '#353E47',
          900: '#1F252B',
        },

        // Semantic aliases
        primary: {
          DEFAULT: '#3A0F34',
          hover: '#4D1847',
          active: '#290A24',
          container: '#4D1847',
        },
        accent: {
          DEFAULT: '#EAAA00',
          hover: '#FFC83B',
          active: '#C78C00',
        },
        secondary: {
          DEFAULT: '#EAAA00',
          container: '#FFF6C5',
          'on-container': '#734E00',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dim: '#F2F4F7',
          bright: '#FFFFFF',
          'container-lowest': '#FFFFFF',
          'container-low': '#F8F9FA',
          container: '#EEF2F5',
          'container-high': '#DDE3E8',
          'container-highest': '#CDD4DB',
        },
        canvas: '#F8F9FA',
        background: '#F8F9FA',
        border: '#CDD4DB',

        // Typography colors
        'on-primary': '#FFFFFF',
        'on-secondary': '#3A0F34',
        'on-surface': '#1E101D',
        'on-surface-variant': '#5C525B',
        'on-canvas': '#1E101D',
        outline: '#CDD4DB',
        'outline-variant': '#DDE3E8',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'street-sm': '0 1px 3px rgba(58, 15, 52, 0.08), 0 1px 2px rgba(58, 15, 52, 0.04)',
        'street-md': '0 4px 12px rgba(58, 15, 52, 0.10), 0 2px 4px rgba(58, 15, 52, 0.06)',
        'street-lg': '0 12px 28px rgba(58, 15, 52, 0.14), 0 4px 8px rgba(58, 15, 52, 0.08)',
        'marigold-glow': '0 4px 16px rgba(234, 170, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
