module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      parser: '@typescript-eslint/parser',
    },
  ],
  extends: [
    "prettier",
    "next/core-web-vitals",
    "plugin:tailwindcss/recommended",
  ],
  plugins: ["@typescript-eslint", "tailwindcss"],
  rules: {
    "tailwindcss/no-contradicting-classname": "off",
  },
  settings: {
    tailwindcss: {
      callees: ["cn"],
      config: "./tailwind.config.js",
    },
  }
}
