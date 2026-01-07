import tailwindcss from "@tailwindcss/postcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          primary: "#FF69B4",
          light: "#FFB6D9",
          pastel: "#FFE4F0",
        },
        purple: {
          accent: "#DDA0DD",
        },
        cream: "#FFF8F0",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [tailwindcss],
};
