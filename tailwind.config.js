/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px', // Extra small devices
        '3xl': '1600px', // Extra large devices
      },
      colors: {
        'neon-purple': '#8b5cf6',
        'neon-blue': '#3b82f6',
        'neon-pink': '#ec4899',
        'neon-green': '#10b981',
        'dark-space': '#0f0f23',
        'space-dark': '#1a1a2e',
        'space-darker': '#111118',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      minHeight: {
        '44': '2.75rem', // Minimum touch target height
      },
      minWidth: {
        '44': '2.75rem', // Minimum touch target width
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
      }
    },
  },
  plugins: [],
}
