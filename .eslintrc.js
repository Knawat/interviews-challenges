module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  extends: ["eslint:recommended", "airbnb-base"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "2017"
  },
  rules: {
    indent: ["warn", 2],
    quotes: ["warn", "double"],
    semi: ["error", "always"],
    "no-var": ["error"],
    "no-console": ["off"],
    "no-unused-vars": ["warn"],
    "no-mixed-spaces-and-tabs": ["warn"]
  }
};
