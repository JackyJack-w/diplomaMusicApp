import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'orange': '#fb8b24',
        'white-text' : "#faf0e6",
        'dark' : '#36454f',
      },
      backgroundImage: {},
      keyframes: {
         pulse: {
          "0%, 100%": { opacity: "1"},
          "50%": { opacity: ".5"}
          },
        fadeIn: {
          from: { opacity: "0", bottom: "0"},
          to: { opacity: "1", bottom: "80px" },
        },
        fadeOut: {
          from: { opacity: "1", bottom: "80px"},
          to: { opacity: "0", bottom: "0px" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: 'translateX(2px)' },
          to: { opacity: "1", transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: 'translateY(2px)' },
          to: { opacity: "1", transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: 'translateX(-2px)' },
          to: { opacity: "1", transform: 'translateX(0)' },
        },
        ping: {
          "75%, 100%": { transform: "scale(2)",  opacity: "0"}
        },
         
        
      },
      animation: {
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        

        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        fadeIn: 'fadeIn 0.5s forwards ease-in-out',
        fadeOut: 'fadeOut 0.5s forwards ease-out',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
export default config

