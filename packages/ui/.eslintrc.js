module.exports = {
  extends: ["@repo/eslint-config/react.js"],
  ignorePatterns: ["**/__tests__/**"],
  rules: {
    // Circular dependency between @repo/ui, @repo/store, and @repo/actions
    // requires architectural refactoring to resolve
    "import/no-cycle": "off",
    // Existing files use PascalCase (e.g. Appbar.tsx, Footer.tsx);
    // renaming requires updating imports across all apps
    "unicorn/filename-case": "off",
  },
};
