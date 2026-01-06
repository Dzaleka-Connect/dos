/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: [
    // Safelist cultural color classes with numeric variants (50-900)
    {
      pattern: /^(bg|text|border)-(terracotta|ochre|earth)(-50|-100|-200|-300|-400|-500|-600|-700|-800|-900)$/,
      variants: ['hover', 'focus', 'active', 'group-hover'],
    },
  ],
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
        // Rich Earth Tones
        terracotta: {
          50: '#fdf6f4',
          100: '#fbece9',
          200: '#f6d5ce',
          300: '#efb3a6',
          400: '#e68a76',
          500: '#de6449', // Base
          600: '#cd4a2d',
          700: '#ab3b23',
          800: '#8d3421',
          900: '#753023',
        },
        ochre: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308', // Base
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        earth: {
          50: '#f6f7f6',
          100: '#e8ebe8',
          200: '#d0d8d1',
          300: '#aebcb0',
          400: '#879e8b',
          500: '#65826b',
          600: '#4e6753', // Base
          700: '#405345',
          800: '#354339',
          900: '#2d3730',
        },
        sand: {
          50: '#faf9f6',
          100: '#f5f4ef',
          200: '#ebe9df',
          300: '#ded9c6',
          400: '#cfc6ab',
          500: '#b8ad8d', // Base
          600: '#9d9171',
          700: '#83785d',
          800: '#6d634e',
          900: '#5a5242',
        },
        vibrant: {
          500: '#9b5de5', // Purple
          600: '#f15bb5', // Pink
          700: '#00bbf9', // Cyan
        },
      },
      fontFamily: {
        'heading': ['Manrope', 'system-ui', 'sans-serif'],
        'body': ['Manrope', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'reveal': 'revealOnScroll 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        revealOnScroll: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}