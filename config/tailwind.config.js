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
        noto: ["Noto Sans JP", "sans-serif"],
        zenmaru: ["Zen Maru Gothic", "sans-serif"],
        playwrite: ["Playwrite TZ"],
        roboto: ["Roboto", "sans-serif"],
      },
      animation: {
        'slide-top': 'slide-top 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'fuwafuwa': 'fuwafuwa 3s ease-in-out infinite alternate'
      },
      keyframes: {
        'slide-top': {
          '0%': { transform: 'translateY(50px)' },
          'to': { transform: 'translateY(0px)' },
        },
        'fuwafuwa' : {
          '0%': {transform: 'translate(0, 0)' },
          '50%': {transform: 'translate(0, -10px)' },
          '100%': {transform: 'translate(0, 0)' },
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


