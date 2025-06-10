/**  @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        'primary-light': '#1e293b',
        'primary-dark': '#0a101c',
        secondary: '#334155',
        'secondary-dark': '#1e293b',
        accent: '#38bdf8',
        'accent-dark': '#0ea5e9',
        card: '#1e293b',
        table: '#0c4a6e'
      }
    },
  },
  plugins: [],
};
 