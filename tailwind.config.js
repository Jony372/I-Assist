/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#9667e0',
        'secondary': '#ebd9fc',
        'tertiary': '#583491',
        'p-hover': '#6945a1',
        'delete-color': '#9667e0',
        'edit-color': '#af89eb',
        'view-color': '#c8aaf6',
        'add-color': '#42a4f5',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

