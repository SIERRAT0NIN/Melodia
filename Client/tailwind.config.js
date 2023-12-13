// // Import the NextUI plugin using ES6 module syntax
import { nextui } from "@nextui-org/react";
import vitePluginTailwind from "vite-plugin-tailwind";
import react from "@vitejs/plugin-react";
import "./postcss.config";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui(), vitePluginTailwind(), react()],
};
