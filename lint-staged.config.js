module.exports = {
  "**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit",
  "*.{js,jsx,mjs,ts,tsx}": ["prettier --write", "eslint --max-warnings=0"],
}
