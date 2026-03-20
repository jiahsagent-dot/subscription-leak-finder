/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e8eef7',
          100: '#c5d3eb',
          200: '#9fb5db',
          300: '#7896cb',
          400: '#527abb',
          500: '#2a5fa0',
          600: '#1d4a83',
          700: '#133566',
          800: '#0a2249',
          900: '#0f2744', // PRIMARY
        },
        waste: '#ef4444',
        safe:  '#22c55e',
        warn:  '#f59e0b',
      },
      boxShadow: {
        card: '0 2px 12px rgba(15,39,68,0.08)',
        'card-hover': '0 4px 24px rgba(15,39,68,0.14)',
      },
    },
  },
  plugins: [],
};
