import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        primary: "var(--primary)",
      },
      fontFamily: {
        "plus-jakarta-sans": "var(--font-plus-jakarta-sans)",
      },
      fontSize: {
        "heading-lg": ["28px", { lineHeight: "42px" }],
        "heading-md": ["24px", { lineHeight: "36px" }],
        "heading-sm": ["20px", { lineHeight: "30px" }],
        "heading-xs": ["18px", { lineHeight: "27px" }],
        "body-xl": ["16px", { lineHeight: "24px" }],
        "body-lg": ["14px", { lineHeight: "20px" }],
        "body-sm": ["12px", { lineHeight: "18px" }],
        "body-xs": ["10px", { lineHeight: "16px" }],
        "body-2xs": ["8px", { lineHeight: "14px" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
