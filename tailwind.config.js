import animations from '@midudev/tailwind-animations'
const purgeCss = require('@fullhuman/postcss-purgecss')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: [
    animations,
    require('@tailwindcss/typography'),
    purgeCss({
      content: ['./**/*.hmtl']
    })
  ]
}
