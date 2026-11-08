import animations from "@midudev/tailwind-animations";
const purgeCss = require("@fullhuman/postcss-purgecss");

/* Almanac: cool slate stock, blue-black ink, one chart magenta.
   Legacy utilities are remapped onto the theme so existing components inherit it. */
const slate = {
  50: "oklch(96% 0.008 245)",
  100: "oklch(92% 0.009 245)",
  200: "oklch(88% 0.010 245)",
  300: "oklch(80% 0.012 245)",
  400: "oklch(68% 0.013 245)",
  500: "oklch(52% 0.015 245)",
  600: "oklch(38% 0.016 245)",
  700: "oklch(28% 0.018 245)",
  800: "oklch(21% 0.019 245)",
  900: "oklch(16% 0.020 245)",
  950: "oklch(12% 0.018 245)",
};

const magenta = {
  50: "oklch(96% 0.020 350)",
  100: "oklch(92% 0.040 350)",
  200: "oklch(85% 0.080 350)",
  300: "oklch(75% 0.120 350)",
  400: "oklch(60% 0.160 350)",
  500: "oklch(45% 0.180 350)",
  600: "oklch(37% 0.160 350)",
  700: "oklch(31% 0.130 350)",
  800: "oklch(25% 0.100 350)",
  900: "oklch(20% 0.080 350)",
  950: "oklch(16% 0.060 350)",
};

const error = {
  50: "oklch(96% 0.020 27)",
  100: "oklch(92% 0.040 27)",
  200: "oklch(85% 0.080 27)",
  300: "oklch(75% 0.120 27)",
  400: "oklch(60% 0.160 27)",
  500: "oklch(52% 0.190 27)",
  600: "oklch(45% 0.170 27)",
  700: "oklch(38% 0.140 27)",
  800: "oklch(30% 0.110 27)",
  900: "oklch(24% 0.090 27)",
};

const success = {
  50: "oklch(96% 0.020 150)",
  100: "oklch(92% 0.040 150)",
  200: "oklch(85% 0.070 150)",
  300: "oklch(75% 0.100 150)",
  400: "oklch(60% 0.120 150)",
  500: "oklch(50% 0.120 150)",
  600: "oklch(43% 0.110 150)",
  700: "oklch(36% 0.090 150)",
  800: "oklch(29% 0.070 150)",
  900: "oklch(23% 0.060 150)",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        "paper-2": "var(--color-paper-2)",
        "paper-3": "var(--color-paper-3)",
        sheet: "var(--color-sheet)",
        ink: "var(--color-ink)",
        "ink-2": "var(--color-ink-2)",
        muted: "var(--color-muted)",
        rule: "var(--color-rule)",
        "rule-2": "var(--color-rule-2)",
        accent: "var(--color-accent)",
        "accent-2": "var(--color-accent-2)",
        "accent-ink": "var(--color-accent-ink)",
        focus: "var(--color-focus)",
        danger: "var(--color-error)",
        ok: "var(--color-success)",
        // Legacy utility names, remapped to the almanac material.
        gray: slate,
        slate: slate,
        teal: magenta,
        blue: magenta,
        indigo: magenta,
        rose: error,
        red: error,
        green: success,
        white: "oklch(96% 0.006 245)",
        black: "oklch(16% 0.020 245)",
      },
      fontFamily: {
        sans: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-body)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-outlier)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px",
      },
      boxShadow: {
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "none",
      },
      borderWidth: {
        hair: "1px",
        bar: "2px",
      },
      maxWidth: {
        measure: "65ch",
        container: "var(--container)",
      },
    },
  },
  plugins: [
    animations,
    require("@tailwindcss/typography"),
    purgeCss({
      content: ["./**/*.hmtl"],
    }),
  ],
};
