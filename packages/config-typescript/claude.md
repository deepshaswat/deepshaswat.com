# Config TypeScript Package - Claude Memory

## What This Package Is

The **config-typescript package** provides shared TypeScript configurations for all apps and packages in the monorepo.

## What Has Been Done

- Base tsconfig for all packages
- Next.js specific configuration
- React library configuration
- Strict mode settings
- Path aliases configuration

## Directory Structure

```
packages/config-typescript/
├── base.json           # Base configuration
├── nextjs.json         # Next.js apps
├── react-library.json  # React packages
└── package.json
```

## Exports

```json
// In package's tsconfig.json
{
  "extends": "@repo/config-typescript/base.json"
}

// For Next.js apps
{
  "extends": "@repo/config-typescript/nextjs.json"
}
```

## Restrictions

- Keep strict mode enabled
- Don't disable type checking features
- Maintain consistent module resolution

## What Needs To Be Done

- [ ] Add configuration for Node.js packages
- [ ] Document path alias conventions
- [ ] Add ESM configuration
- [ ] Create configuration for tests
