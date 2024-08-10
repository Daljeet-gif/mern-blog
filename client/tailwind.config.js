/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    flowbite.content(),
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
    require("flowbite/plugin"),
    require("tailwind-scrollbar"),
  ],
};
