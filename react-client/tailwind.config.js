/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {

    

    extend: {
      colors: {

        'ramaa_darkblue': '#1e2433',
        'ramaa_inputText': '#ff3892',
        'ramaa_buttonHover': '#ff3892',

      },
      keyframes: {
          "fade-in": {
              '0%'  : { opacity: "0" },
              '100%': { opacity: "1" }
          },
          "fade-out": {
              '0%'  : { opacity: "1" },
              '100%': { opacity: "0" }
          },
      },
      animation: {
          "fade-in": 'fade-in 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both',
          "fade-out": 'fade-out 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both',
      },

    },
  },

  plugins: [],
}