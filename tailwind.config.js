/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{tsx,ts,jsx,js}",
    "./src/components/**/*.{tsx,ts,jsx,js}",
    "./src/app/**/*.{tsx,ts,jsx,js}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        notoKufi: ["Noto-Kufi-Arabic", "serif"],
        english: ["Public-Sans", "sans-serif"],
        arabic: ["Noto-Naskh-Arabic", "serif"],
        verses: ["Quran-verse", "sans-serif"],
      },
      colors: {
        primary: "#339933",
        secondary: "#f69002",
      },
    },
  },
  plugins: [],
};
