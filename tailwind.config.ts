import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        slideup: "slideup 0.2s ease-in-out",
        slidedown: "slidedown 0.2s ease-in-out",
      },
      keyframes: {
        slideup: {
          from: { opacity: "0", transform: "translateY(25%)" },
          to: { opacity: "1", transform: "none" },
        },
        slidedown: {
          from: { opacity: "0", transform: "translateY(-25%)" },
          to: { opacity: "1", transform: "none" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
