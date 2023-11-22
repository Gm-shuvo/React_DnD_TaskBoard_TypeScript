/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainLightBackgroundColor: "#F2F2F2",
        mainDarkBackgroundColor: "#0D1117",
        mainBackgroundColor: "#F2F2F2",
        darkColumnBackgroundColor: "#161C22",
        lightColumnBackgroundColor: "#CFCFCF",
      },
    },
  },
  plugins: [],
};
