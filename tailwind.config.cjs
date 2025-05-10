/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}", // shadcn/ui 사용 시 필요
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
