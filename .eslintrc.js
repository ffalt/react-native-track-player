module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "@react-native-community"
  ],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module" // Allows for the use of imports
  },
  rules: {
    "prettier/prettier": "off",
    "comma-dangle": ["error", { "functions": "ignore" }]
  }
};
