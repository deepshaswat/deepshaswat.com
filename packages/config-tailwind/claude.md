# Config Tailwind Package - Claude Memory

## What This Package Is

The **config-tailwind package** provides shared Tailwind CSS configuration for all apps and packages in the monorepo.

## What Has Been Done

- Base Tailwind configuration
- Custom color palette
- Typography configuration
- Responsive breakpoints
- Animation utilities
- Dark mode configuration

## Directory Structure

```
packages/config-tailwind/
├── tailwind.config.ts    # Shared configuration
└── package.json
```

## Exports

```typescript
// In app's tailwind.config.ts
import sharedConfig from "@repo/config-tailwind";

export default {
  presets: [sharedConfig],
  // app-specific overrides
};
```

## Restrictions

- All color changes should be in CSS variables for theme support
- Maintain dark mode compatibility
- Don't remove existing utilities without checking usage

## What Needs To Be Done

- [ ] Add custom animation presets
- [ ] Create consistent spacing scale
- [ ] Add print media styles
- [ ] Document color palette usage
- [ ] Add container query utilities
