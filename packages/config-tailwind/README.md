# @repo/config-tailwind - Tailwind Configuration

Shared Tailwind CSS configuration for the deepshaswat.com monorepo.

## Installation

This package is internal to the monorepo and available via workspace imports.

```javascript
// In tailwind.config.ts
import sharedConfig from "@repo/config-tailwind";
```

## Exports

| Export    | Description                 |
| --------- | --------------------------- |
| `default` | Base Tailwind configuration |

## Configuration

### Preset Usage

```typescript
// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";
import sharedConfig from "@repo/config-tailwind";

const config: Config = {
  presets: [sharedConfig],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // App-specific overrides
};

export default config;
```

## Included Configuration

| Feature       | Description                      |
| ------------- | -------------------------------- |
| Color Palette | Custom colors with CSS variables |
| Typography    | Font families and sizes          |
| Spacing       | Consistent spacing scale         |
| Breakpoints   | Responsive breakpoints           |
| Animations    | Custom animation utilities       |
| Dark Mode     | Dark mode via class strategy     |

## Custom Utilities

| Utility            | Description          |
| ------------------ | -------------------- |
| `animate-fade-in`  | Fade in animation    |
| `animate-slide-up` | Slide up animation   |
| `text-gradient`    | Gradient text effect |

## CSS Variables

Colors use CSS variables for theme support:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}

.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  /* ... dark mode variables */
}
```

## Usage in Components

```typescript
// Use Tailwind classes
<div className="bg-background text-foreground">
  <h1 className="text-primary">Hello</h1>
</div>
```
