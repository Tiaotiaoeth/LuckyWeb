/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem', // 12
      sm: '0.875rem', // 14
      base: '1rem', // 16
      lg: '1.125rem', // 18
      xl: '1.25rem', // 20
      '2xl': '1.5rem', // 24
      '3xl': '1.75rem', // 28
      '4xl': '2.25rem', // 36
      '5xl': '3rem', // 48
      '6xl': '4rem', // 64
      '7xl': '5rem', // 80
      '8xl': '6rem', // 96
      '9xl': '8rem', // 128
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [
    // ...
    require('@tailwindcss/aspect-ratio'),
  ],
};
