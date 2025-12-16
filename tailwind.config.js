/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const flowbitePlugin = require('flowbite/plugin');
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-qwik/**/*.{cjs,mjs}",
    "./src/**/*.{html,js,jsx,ts,tsx,mdx}"
  ],
  theme: {
    extend: {
      spacing: {
        '0.75': '0.1875rem', // 3px (since 1rem = 16px, 3/16 = 0.1875rem)
      },
        gridTemplateColumns: {
        '7/4': 'repeat(4, minmax(0, 1.75fr))', // Approx 7/4 columns
      },
      borderWidth: {
        '1.5': '1.5px',
      },
      screens: {
        xs: '480px',
      },
      colors: {
        // Musician/Violinist Portfolio Theme - Deep Purples, Gold, and Slate
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',

        },
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',

        },
        tertiary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',

        },
 
     
        alert: {
          DEFAULT: 'hsl(var(--alert))',
          foreground: 'hsl(var(--alert-foreground))',
        },
   
      },
  
  
      strokeWidth: {
        0: '0',
        base: 'var(--stroke-width)',
        1: 'calc(var(--stroke-width) + 1px)',
        2: 'calc(var(--stroke-width) + 2px)',
      },
      fontFamily: {
        sans: ["'Inter Variable'", ...defaultTheme.fontFamily.sans],
      },
fontSize: {
  '2xs': '0.625rem', // 10px
  '2.5xl': ['1.625rem', { lineHeight: '1.75rem' }], // 26px, line-height 28px
  '4.5xl': ['2.625rem', { lineHeight: '2.75rem' }],
  '5.5xl': ['3.375rem', { lineHeight: '3.5rem' }],
},
      animation: {
        'from-left': 'slideFromLeft 0.2s 1',
        'from-right': 'slideFromRight 0.2s 1',
        'accordion-up': 'collapsible-up 0.2s ease-out 0s 1 normal forwards',
        'accordion-down': 'collapsible-down 0.2s ease-out 0s 1 normal forwards',
        'fade-up': 'fadeUp 0.5s ease-in forwards',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
     
        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideFromLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideFromRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--qwikui-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--qwikui-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      transitionTimingFunction: {
        step: 'cubic-bezier(0.6, 0.6, 0, 1)',
        jumpy: 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('tailwindcss-animate'),
    require('tailwindcss-motion'),
    require('tailwindcss-intersect'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.press': {
          transform: 'var(--transform-press)',
        },
      });
    }),
    flowbitePlugin,
  ],
  darkMode: "class",
};