import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'DM Mono'", "monospace"],
      },
      colors: {
        forest:  "#0a1a0f",
        canopy:  "#0f2518",
        moss:    "#163320",
        lime:    "#7fff47",
        "lime-dim": "#5dd630",
        sage:    "#3a6b45",
        mist:    "#c8e6c0",
        fog:     "#8fb898",
        paper:   "#f0f7ee",
      },
      borderRadius: {
        xl2: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
