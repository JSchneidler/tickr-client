const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      gray: colors.gray,
      green: colors.green,
      red: colors.red,
      white: colors.white,
    },
  },
  plugins: [],
}
