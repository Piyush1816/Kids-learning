/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: '#E0F2FE',
          sky: '#BAE6FD',
          mint: '#D1FAE5',
          green: '#A7F3D0',
          yellow: '#FEF08A',
          amber: '#FDE68A',
          peach: '#FFEDD5',
          coral: '#FFE4E6',
          pink: '#FCE7F3',
          lavender: '#EDE9FE',
          purple: '#DDD6FE'
        },
        brand: {
          sky: '#38BDF8',
          mint: '#34D399',
          yellow: '#FBBF24',
          coral: '#FB7185',
          lavender: '#A78BFA',
          orange: '#FB923C'
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Quicksand', 'cursive', 'sans-serif']
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}
