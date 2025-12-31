/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#E5C158', // lighter gold
                    DEFAULT: '#D4AF37', // GOLD - matches Vercel
                    dark: '#C9A532', // darker gold
                },
                secondary: '#004D40', // Deep Pakistan Green
            }
        },
    },
    plugins: [],
}
