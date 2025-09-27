/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px',
      },
      colors: {
        gray: {
          750: '#374151',
          850: '#1f2937',
          925: '#0f172a',
        },
        white: {
          '0.02': 'rgba(255, 255, 255, 0.02)',
          '0.03': 'rgba(255, 255, 255, 0.03)',
          '0.04': 'rgba(255, 255, 255, 0.04)',
          '0.06': 'rgba(255, 255, 255, 0.06)',
          '0.08': 'rgba(255, 255, 255, 0.08)',
          '0.12': 'rgba(255, 255, 255, 0.12)',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
