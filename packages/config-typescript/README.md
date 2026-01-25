# @repo/config-typescript - TypeScript Configuration

Shared TypeScript configurations for the deepshaswat.com monorepo.

## Installation

This package is internal to the monorepo and available via workspace imports.

```json
// In tsconfig.json
{
  "extends": "@repo/config-typescript/base.json"
}
```

## Exports

| Configuration | Description |
|---------------|-------------|
| `base.json` | Base configuration for all packages |
| `nextjs.json` | Configuration for Next.js apps |
| `react-library.json` | Configuration for React library packages |

## Configurations

### Base Configuration (`base.json`)

Used by all packages as a foundation:

```json
{
  "extends": "@repo/config-typescript/base.json"
}
```

**Features:**
- Strict mode enabled
- ES2020 target
- Module resolution settings
- Path aliases support

### Next.js Configuration (`nextjs.json`)

Used by Next.js applications:

```json
{
  "extends": "@repo/config-typescript/nextjs.json"
}
```

**Features:**
- Next.js plugin integration
- JSX support
- Server/client component types
- App Router types

### React Library Configuration (`react-library.json`)

Used by React component packages:

```json
{
  "extends": "@repo/config-typescript/react-library.json"
}
```

**Features:**
- React JSX transform
- Declaration file generation
- Library-optimized settings

## Usage Examples

### For Next.js App

```json
// apps/web/tsconfig.json
{
  "extends": "@repo/config-typescript/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### For Package

```json
// packages/ui/tsconfig.json
{
  "extends": "@repo/config-typescript/react-library.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Compiler Options

| Option | Value | Description |
|--------|-------|-------------|
| `strict` | `true` | Enable strict type checking |
| `target` | `ES2020` | ECMAScript target version |
| `moduleResolution` | `bundler` | Module resolution strategy |
| `esModuleInterop` | `true` | ES module interoperability |
| `skipLibCheck` | `true` | Skip type checking of declaration files |
