/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9d3e1c',
        'primary-container': '#bd5632',
        'on-primary': '#ffffff',
        'on-primary-container': '#fffbff',
        'primary-fixed': '#ffdbd0',
        'primary-fixed-dim': '#ffb59d',
        'on-primary-fixed': '#390c00',
        'on-primary-fixed-variant': '#802a07',

        secondary: '#3d6659',
        'secondary-container': '#bce9d9',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#416b5d',
        'secondary-fixed': '#bfecdc',
        'secondary-fixed-dim': '#a3d0c0',

        tertiary: '#755700',
        'tertiary-container': '#946f00',
        'on-tertiary': '#ffffff',
        'tertiary-fixed': '#ffdf9e',
        'tertiary-fixed-dim': '#efc055',

        background: '#f5fbf3',
        surface: '#f5fbf3',
        'surface-dim': '#d6dcd4',
        'surface-bright': '#f5fbf3',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff5ee',
        'surface-container': '#eaefe8',
        'surface-container-high': '#e4eae2',
        'surface-container-highest': '#dee4dd',

        'on-surface': '#171d19',
        'on-surface-variant': '#56423c',
        outline: '#8a726a',
        'outline-variant': '#ddc0b8',
        'inverse-surface': '#2c322d',
        'inverse-on-surface': '#edf2eb',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
