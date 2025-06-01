const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,html,slim}'
  ],
  theme: {
    extend: {
      screens: {
        'xs': '360px',
      },
      fontFamily: {
        body: ["Noto Sans JP", "Zen Maru Gothic", "sans-serif"],
        zenmaru: ["Zen Maru Gothic"],
        playwrite: ["Playwrite TZ"],
      },
      animation: {
        'slide-top': 'slide-top 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      },
      keyframes: {
        'slide-top': {
          '0%': { transform: 'translateY(50px)' },
          'to': { transform: 'translateY(0px)' },
        },
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/container-queries'),
  ],
  darkMode: 'class'
}
