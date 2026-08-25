/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // Brand Primary
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        'heading': ['Manrope', 'system-ui', 'sans-serif'],
        'body': ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '0',
        tight: '0',
      },
      typography: {
        DEFAULT: {
          css: {
            // The typography plugin wraps every inline <code> in literal
            // backticks via ::before/::after. Inline code is already styled,
            // so the backticks are visible noise.
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
