/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem', // Default padding
        screens: {
          sm: '100%', // Full width until small breakpoint
          md: '100%', // Full width until medium breakpoint
          lg: '1024px', // Max width for large screens
          xl: '1280px', // Max width for extra-large screens
        },
      },
      colors:{
        tn_pink: '#FD027E',
        tn_text_grey: '#717171',
        tn_light_grey: '#EDEDED',
        tn_dark: '#222222', 
        tn_light: '#F7F7F7',
        tn_dark_field: '#1C1B1F',
      },
      fontFamily:{
        'lato': ["Lato", 'sans-serif']
      },
      backgroundImage: {
        'hero': "url('/src/assets/Images/banner.png')",
        'appbanner': "url('/src/assets/Images/app-banner.png')",
      },
      screens: {
        'sc-1920': {'min': '1900px'},
        'vxs': {'max': '480px'},
      },
    },
  },
  plugins: [],
}