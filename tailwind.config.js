/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-pink": "#ff00ff",
        "neon-blue": "#00ffff",
        "neon-purple": "#bf00ff",
        "deep-bg": "#0f0f1a",
        "glass-border": "rgba(255, 255, 255, 0.1)",
        "glass-bg": "rgba(255, 255, 255, 0.05)",
      },
      backgroundImage: {
        "synthwave-grid":
          "linear-gradient(rgba(15, 15, 26, 0.9), rgba(15, 15, 26, 0.9)), repeating-linear-gradient(0deg, transparent, transparent 19px, #bf00ff 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #bf00ff 20px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        neon: "0 0 10px rgba(191, 0, 255, 0.5), 0 0 20px rgba(191, 0, 255, 0.3)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
    },
  },
  plugins: [],
};
