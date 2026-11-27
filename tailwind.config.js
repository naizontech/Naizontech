/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
      },
      colors: {
        ink: '#060915',
        panel: '#0c1124',
      },
      boxShadow: {
        glow: '0 20px 80px rgba(86,75,255,.18)',
      },
    },
  },
  plugins: [],
}
