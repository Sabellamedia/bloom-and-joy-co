/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blush: '#EBE1E5',
          'blush-dark': '#D9CDD2',
          sage: '#8FA58B',
          'sage-dark': '#6B8568',
          mauve: '#A69386',
          'mauve-dark': '#826F63',
          charcoal: '#3D3238',
          cream: '#FBF9FA',
          linen: '#F5F0F2',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        heading: ['"Josefin Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        boutique: '0.28em',
      },
      boxShadow: {
        boutique: '0 24px 60px -20px rgba(61, 50, 56, 0.18)',
        'boutique-sm': '0 8px 30px -12px rgba(61, 50, 56, 0.12)',
      },
    },
  },
  plugins: [],
};
