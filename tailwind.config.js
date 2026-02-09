/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Electric Blue
        "primary-hover": "#2563EB",
        "obsidian": "#050505", // Deepest black
        "obsidian-light": "#0F0F0F",
        "surface-dark": "#161616",
        "accent-green": "#10B981", // Emerald Green
        "glass-border": "rgba(255, 255, 255, 0.1)",
        "glass-bg": "rgba(255, 255, 255, 0.03)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        'lovable-glow': 'conic-gradient(from 180deg at 50% 50%, #2E00FB 0deg, #E100FF 180deg, #2E00FB 360deg)',
      },
      boxShadow: {
        'glow': '0 0 60px -15px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
