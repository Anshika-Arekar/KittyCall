import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        y2k: {
          bg: "#F6EEDC",
          cream: "#FFF8E8",
          pink: "#F3A6B8",
          coral: "#F08080",
          purple: "#9B8ACB",
          blue: "#8DB7D6",
          green: "#A7C98B",
          dark: "#292631",
        },
      },
      boxShadow: {
        "retro-sm": "2px 2px 0px #292631",
        "retro": "3px 3px 0px #292631",
        "retro-lg": "5px 5px 0px #292631",
        "retro-inset": "inset 2px 2px 0px rgba(255,255,255,0.6), inset -2px -2px 0px rgba(0,0,0,0.15)",
      },
      borderRadius: {
        "retro": "12px",
        "retro-lg": "18px",
      },
    },
  },
  plugins: [],
};
export default config;
