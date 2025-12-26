const colorVar = (token) => `var(${token})`

const statusPalette = ({ soft, border, main, dark }) => ({
  50: colorVar(soft),
  100: colorVar(soft),
  200: colorVar(border ?? soft),
  300: colorVar(border ?? soft),
  500: colorVar(main),
  600: colorVar(main),
  700: colorVar(dark ?? main),
  800: colorVar(dark ?? main),
})

const primaryPalette = {
  50: colorVar('--color-primary-50'),
  100: colorVar('--color-primary-100'),
  200: colorVar('--color-primary-200'),
  300: colorVar('--color-primary-light'),
  400: colorVar('--color-primary-light'),
  500: colorVar('--color-primary'),
  600: colorVar('--color-primary'),
  700: colorVar('--color-primary-dark'),
  DEFAULT: colorVar('--color-primary'),
}

const grayPalette = {
  50: colorVar('--color-background-secondary'),
  100: colorVar('--color-hover-bg'),
  200: colorVar('--color-border'),
  300: colorVar('--color-border'),
  400: colorVar('--color-text-tertiary'),
  500: colorVar('--color-text-secondary'),
  600: colorVar('--color-text-secondary-strong'),
  700: colorVar('--color-text'),
  800: colorVar('--color-text'),
  900: colorVar('--color-text'),
}

const bluePalette = {
  50: colorVar('--color-secondary-50'),
  100: colorVar('--color-secondary-100'),
  200: colorVar('--color-secondary-200'),
  500: colorVar('--color-secondary'),
  600: colorVar('--color-secondary-dark'),
  800: colorVar('--color-accent'),
}

const purplePalette = {
  100: colorVar('--color-accent-soft'),
  500: colorVar('--color-accent'),
  600: colorVar('--color-accent'),
}

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
        gray: grayPalette,
        primary: primaryPalette,
        teal: primaryPalette,
        blue: bluePalette,
        purple: purplePalette,
        red: statusPalette({
          soft: '--color-error-soft',
          border: '--color-error-border',
          main: '--color-error',
          dark: '--color-error-dark',
        }),
        green: statusPalette({
          soft: '--color-success-soft',
          border: '--color-success-border',
          main: '--color-success',
          dark: '--color-success-dark',
        }),
        yellow: statusPalette({
          soft: '--color-warning-soft',
          border: '--color-warning-border',
          main: '--color-warning',
          dark: '--color-warning-dark',
        }),
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

