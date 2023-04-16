/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#0197F6",
        primaryHover: "#018ADF",
        primaryActive: "#0861AF",
        secondary: "#F9F9F9",
      },
    },
  },
  plugins: [],
};
