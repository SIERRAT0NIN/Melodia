// export default {
//   plugins: [require("tailwindcss"), require("autoprefixer")],
// };
// Importing the plugins at the top
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// Exporting the configuration with the imported plugins
export default {
  plugins: [tailwindcss, autoprefixer],
};
