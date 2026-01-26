const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/react",
    "@vercel/style-guide/eslint/next",
  ].map(require.resolve),
  plugins: ["turbo"],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
      node: {
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        includeInternal: true,
        includeTypes: true,
        packageDir: [__dirname, process.cwd()],
      },
    ],
    "turbo/no-undeclared-env-vars": "warn",
    // Remaining relaxed rules
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/no-shadow": "warn",
    "@typescript-eslint/non-nullable-type-assertion-style": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/consistent-type-imports": "warn",
    "eslint-comments/require-description": "warn",
    "import/named": "warn",
    "import/no-duplicates": "warn",
    "import/no-named-as-default-member": "warn",
    "func-names": "warn",
    "react/display-name": "warn",
  },
};
