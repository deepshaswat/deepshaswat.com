# @repo/config-eslint - ESLint Configuration

Shared ESLint configurations for the deepshaswat.com monorepo.

## Installation

This package is internal to the monorepo and available via workspace imports.

```javascript
// In eslint.config.js
const config = require("@repo/config-eslint/next");
module.exports = config;
```

## Exports

| Configuration       | Description                               |
| ------------------- | ----------------------------------------- |
| `library.js`        | Configuration for library packages        |
| `next.js`           | Configuration for Next.js apps            |
| `react-internal.js` | Configuration for internal React packages |

## Configurations

### Library Configuration (`library.js`)

Used by non-React library packages:

```javascript
// packages/schema/eslint.config.js
const config = require("@repo/config-eslint/library");
module.exports = config;
```

**Features:**

- TypeScript support
- Import sorting
- General best practices

### Next.js Configuration (`next.js`)

Used by Next.js applications:

```javascript
// apps/web/eslint.config.js
const config = require("@repo/config-eslint/next");
module.exports = config;
```

**Features:**

- Next.js specific rules
- React hooks rules
- Core web vitals rules

### React Internal Configuration (`react-internal.js`)

Used by internal React component packages:

```javascript
// packages/ui/eslint.config.js
const config = require("@repo/config-eslint/react-internal");
module.exports = config;
```

**Features:**

- React specific rules
- Hooks linting
- JSX accessibility

## Rules Included

| Category   | Rules                            |
| ---------- | -------------------------------- |
| TypeScript | `@typescript-eslint/recommended` |
| React      | `eslint-plugin-react`            |
| Hooks      | `eslint-plugin-react-hooks`      |
| Import     | Import ordering and sorting      |
| Next.js    | `@next/eslint-plugin-next`       |

## Usage Examples

### Extending Configuration

```javascript
// eslint.config.js
const baseConfig = require("@repo/config-eslint/next");

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    // Override or add rules
    "no-console": "warn",
  },
};
```

### Ignoring Files

```javascript
// eslint.config.js
const baseConfig = require("@repo/config-eslint/next");

module.exports = {
  ...baseConfig,
  ignorePatterns: ["node_modules/", ".next/", "dist/"],
};
```

## Running ESLint

```bash
# From root
pnpm lint

# From specific app/package
cd apps/web && pnpm lint
```
