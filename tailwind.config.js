/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#E8B639',
        textPrimary: '#ffffff',
        arrow: '#000000',
        white: '#ffffff',
        cross: '#CB4040',
        tick: '#E8B639',
        black: '#000000',
        borderTop: 'rgba(251, 206, 82, 1)',
        borderBottom: '#FCE49C',
        subText: '#555555',
        inputBorder: '#cccccc',
        mapBorder: '#33A1E0',
        green: '#48B02C',
        link: '#1700eb',
        blur: 'rgba(0, 0, 0, 0.6)',
        gray: '#C3C3C3',
        secondary: '#E8B639', // main color
        lightTertiary: '#FCE49C',
        tertiary: '#FFEEAE',
        card1: '#FBF9D1',
        card2: '#F8EDED',
        card3: '#FFE5CA',
        card4: '#A8F1FF',
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
