// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         inter: ["Inter", "sans-serif"],
//         outfit: ["Outfit", "sans-serif"],
//         rajdhani: ["Rajdhani", "sans-serif"],
//         spaceGrotesk: ["Space Grotesk", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// }

// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
        spaceGrotesk: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
}
