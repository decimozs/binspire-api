import antfu from "@antfu/eslint-config";

export default antfu({
  formatters: true,
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
  },
  ignores: ["**/migrations/*"],
  rules: {
    "no-console": ["warn"],
    "node/no-process-env": ["error"],
    "perfectionist/sort-imports": "off",
    "perfectionist/sort-named-imports": "off",
    "antfu/no-top-level-await": ["off"],
    "node/prefer-global/process": ["off"],
    "style/arrow-parens": ["off"],
    "style/brace-style": ["off"],
    "style/operator-linebreak": ["off"],
    "style/quote-props": ["off"],
    "antfu/if-newline": ["off"],
    "antfu/top-level-function": ["off"],
  },
});
