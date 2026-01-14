/** @type {import('tailwindcss').Config} */
export default {
  content: ["./Backend/public/**/*.html"],
    safelist: [
    "bg-green-500", "hover:bg-green-600",
    "bg-gray-400", "hover:bg-gray-500",
    "bg-blue-500", "hover:bg-blue-600",
    "bg-yellow-400", "hover:bg-yellow-500",
    "bg-red-500", "hover:bg-red-600",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
