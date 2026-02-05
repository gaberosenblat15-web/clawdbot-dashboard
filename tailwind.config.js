/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Calford AI Brand Colors
        primary: {
          DEFAULT: '#6B46C1',
          light: '#805AD5',
          dark: '#553C9A',
        },
        accent: {
          DEFAULT: '#38A169',
          light: '#48BB78',
          dark: '#2F855A',
        },
        surface: {
          DEFAULT: '#1a1a2e',
          light: '#252542',
          dark: '#0f0f1a',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(107, 70, 193, 0.1) 0%, rgba(56, 161, 105, 0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(107, 70, 193, 0.2)',
        'glow': '0 0 20px rgba(107, 70, 193, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'thinking': 'thinking 1.5s ease-in-out infinite',
      },
      keyframes: {
        thinking: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
