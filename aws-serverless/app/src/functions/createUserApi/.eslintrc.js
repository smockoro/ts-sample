module.exports = {
  extends: [
    "@ts-sample/eslint-config",
  ],
  env: { node: true, es6: true },
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  }
}
