/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['./library.js'],
  parserOptions: {
    ecmaVersion: 2020,
    project: true
  }
}
