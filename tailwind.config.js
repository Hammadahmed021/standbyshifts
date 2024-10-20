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
        tn_pink: '#0000F8',
        tn_primary: '#F59200',
        tn_text_grey: '#656565',
        tn_light_grey: '#EDEDED',
        tn_dark: '#1E1E1E', 
        tn_light: '#F7F7F7',
        tn_dark_field: '#1C1B1F',
        tn_dark_blue: '#2D3748',
        tn_green: '#5EB676',
        tn_purple: '#BC64A8',
        tn_brown: '#C69153'


      },
      borderRadius: {
        'site': '50px', // Custom border radius
      },
      fontFamily:{
        'lato': ["Montserrat", 'sans-serif']
      },
      backgroundImage: {
        'hero': "url('/src/assets/Images/banner.png')",
        'appbanner': "url('/src/assets/Images/app-banner.png')",
        'tybanner': "url('/src/assets/Images/ty-banner.png')",
        'nearby-bg': "url('/src/assets/Images/nearby-bg.png')",
      },
      screens: {
        'sc-1920': {'min': '1900px'},
        'vxs': {'max': '480px'},
      },
    },
  },
  plugins: [],
}