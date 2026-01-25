# Config ESLint Package - Claude Memory

## What This Package Is

The **config-eslint package** provides shared ESLint configurations for all apps and packages in the monorepo.

## What Has Been Done

- Base ESLint configuration
- Next.js specific rules
- React hooks linting
- TypeScript integration
- Import sorting rules

## Directory Structure

```
packages/config-eslint/
├── library.js          # Library packages
├── next.js             # Next.js apps
├── react-internal.js   # Internal React packages
└── package.json
```

## Exports

```javascript
// In package's eslint.config.js
const config = require("@repo/config-eslint/library");
module.exports = config;

// For Next.js apps
const config = require("@repo/config-eslint/next");
module.exports = config;
```

## Restrictions

- Don't disable critical rules without justification
- Keep consistent with Prettier formatting
- Maintain TypeScript strict checks

## What Needs To Be Done

- [ ] Add accessibility (a11y) rules
- [ ] Configure import order rules
- [ ] Add performance linting rules
- [ ] Create custom rules documentation
