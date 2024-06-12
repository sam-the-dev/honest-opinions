import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", ...fontFamily.sans],
        poppins: ["Poppins", ...fontFamily.sans],
      },

      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
          typewriter: {
            to: {
              left: "100%",
            },
          },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        typewriter: "typewriter 2s steps(11) forwards",
      },
    },
  },
};

export default config;
