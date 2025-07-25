/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'sans-regular': ['HostGrotesk_400Regular'],
        'sans-medium': ['HostGrotesk_500Medium'],
        'sans-semibold': ['HostGrotesk_600SemiBold'],
        'sans-bold': ['HostGrotesk_700Bold'],
      },
      colors: {
        black: {
          DEFAULT: '#000',
          700: '#18181B',
        },
        gray: {
          100: '#FAFAFA',
          200: '#F4F4F5',
          300: '#F3F4F6',
          400: '#E4E4E7',
          500: '#D9D9D9',
          600: '#A1A1AA',
          700: '#71717A',
        },
        purple: {
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7C3AED',
          800: '#2E1065',
        },
        support: {
          ambar: '#FFFF00',
          green: '#10B981',
          orange: '#F4A462',
          red: '#EF4444',
          teal: '#2A9D90',
          tomato: '#E76E50',
          yellow: '#E8C468',
        },
      },
    },
  },
};
