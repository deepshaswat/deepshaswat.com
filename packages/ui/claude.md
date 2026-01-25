# UI Package - Claude Memory

## What This Package Is

The **ui package** is the shared React component library for the monorepo. It contains Shadcn/ui base components, custom web components, and admin components. All styling uses Tailwind CSS.

## What Has Been Done

### Base Components (`src/components/ui/`)

Shadcn/ui components customized for the project:

- Button, Card, Dialog, Alert
- Form, Input, Label, Textarea
- Select, Multi-select, Checkbox
- Table, Pagination
- Tooltip, Popover, Dropdown
- Calendar, Date Picker
- Accordion, Breadcrumb
- Avatar, Badge, Skeleton

### Web Components (`src/components/web/`)

#### Articles

- `blog-content.tsx` - Blog post reader with BlockNote rendering
- `blocknote-render.tsx` - BlockNote content renderer
- `featured-blogs-grid.tsx` - Featured posts showcase
- `all-blogs-list.tsx` - Article listing with pagination
- `all-newsletter-list.tsx` - Newsletter listing
- Skeleton loaders for loading states

#### Navigation

- `Appbar.tsx` - Header navigation
- `navigation.tsx` - Nav items configuration
- `nav-button.tsx` - Navigation buttons
- `Footer.tsx` - Site footer

#### Newsletter

- `newsletter-subscribe.tsx` - Subscription form
- `newsletter-unsubscribe.tsx` - Unsubscribe form

#### Posts

- `Post.tsx` - Post card component
- `base-client.tsx` - Client-side post wrapper
- `base-static.tsx` - Static post wrapper
- `GradientText.tsx` - Gradient text effect

#### Pages

- `landing.tsx` - Hero landing section
- `about.tsx` - About page content
- `projects.tsx` - Portfolio projects
- `library.tsx` - Resource library
- `uses.tsx` - Tech stack display
- `link-component.tsx` - Bio links page
- `contact.tsx` - Contact form
- `reminder.tsx` - Reminder feature

#### Utilities

- `CommandBar.tsx` - Command palette (kbar)
- `GoogleAnalytics.tsx` - Analytics integration
- `posthog-providers/` - PostHog setup
- `error-page/` - Error display components

### Custom Components (`src/components/`)

- `markdown-editor.tsx` - Rich text editor wrapper
- `time-picker.tsx` - Time selection
- `date-picker.tsx` - Date selection
- `callout-block.tsx` - Info/alert callouts
- `single-image-dropzone.tsx` - Image upload zone
- `upload-image-component.tsx` - S3 image uploader
- `youtube-blocknote.tsx` - YouTube embed
- `custom-sign-in.tsx` - Clerk sign-in customization
- `divider.tsx` - Horizontal divider
- `spinner.tsx` - Loading spinner
- `theme-provider.tsx` - Theme context

### Common Components (`src/components/common/`)

- `blocknote-to-markdown.tsx` - BlockNote to markdown converter
- `email-template.tsx` - Email HTML template generator
- `pagination-bar.tsx` - Pagination UI

## Directory Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn/ui base
│   │   ├── web/             # Web app components
│   │   ├── common/          # Shared utilities
│   │   └── *.tsx            # Custom components
│   └── index.ts             # Exports
├── tailwind.config.ts       # Tailwind configuration
└── package.json
```

## Restrictions

- Components must be client-side compatible (`"use client"`)
- No direct database or API calls in components
- Use Recoil for state management
- Follow Tailwind CSS conventions
- Maintain dark mode support in all components
- No hardcoded colors - use CSS variables

## What Needs To Be Done

- [ ] Add Storybook for component documentation
- [ ] Implement component unit tests
- [ ] Add accessibility (a11y) auditing
- [ ] Create component variants (sizes, colors)
- [ ] Add animation presets
- [ ] Implement skeleton loaders for all async components
- [ ] Add error boundary components
- [ ] Create print-friendly stylesheets

## Key Dependencies

- `@radix-ui/*` - Accessibility primitives
- `@blocknote/react` - Rich editor
- `@mantine/core` - Design system
- `lucide-react` - Icons
- `framer-motion` - Animations
- `sonner` - Toast notifications
- `react-markdown` - Markdown rendering
- `kbar` - Command palette

## Usage Examples

```typescript
// Import base components
import { Button, Card, Dialog } from "@repo/ui/components/ui";

// Import web components
import { BlogContent } from "@repo/ui/components/web/articles";
import { Appbar, Footer } from "@repo/ui/components/web";

// Import custom components
import { MarkdownEditor } from "@repo/ui/components/markdown-editor";
```
