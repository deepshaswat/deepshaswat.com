# @repo/ui - UI Component Library

Shared React component library for the deepshaswat.com monorepo. Built with Shadcn/ui, Tailwind CSS, and custom components.

## Installation

This package is internal to the monorepo and available via workspace imports.

```typescript
import { Button, Card, Dialog } from "@repo/ui/components/ui";
import { BlogContent } from "@repo/ui/components/web/articles";
```

## Component Categories

### Base UI Components (`components/ui/`)

Shadcn/ui components customized for the project:

| Component     | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `Button`      | Button with variants (default, destructive, outline, ghost) |
| `Card`        | Card container with header, content, footer                 |
| `Dialog`      | Modal dialog with overlay                                   |
| `Alert`       | Alert messages with variants                                |
| `Input`       | Text input field                                            |
| `Textarea`    | Multi-line text input                                       |
| `Label`       | Form label                                                  |
| `Select`      | Single select dropdown                                      |
| `MultiSelect` | Multi-select dropdown                                       |
| `Checkbox`    | Checkbox input                                              |
| `Table`       | Data table with sorting                                     |
| `Pagination`  | Pagination controls                                         |
| `Tooltip`     | Hover tooltips                                              |
| `Popover`     | Click popovers                                              |
| `Dropdown`    | Dropdown menu                                               |
| `Calendar`    | Date calendar                                               |
| `DatePicker`  | Date selection                                              |
| `Accordion`   | Collapsible sections                                        |
| `Breadcrumb`  | Navigation breadcrumbs                                      |
| `Avatar`      | User avatar                                                 |
| `Badge`       | Status badges                                               |
| `Skeleton`    | Loading placeholders                                        |

### Web Components (`components/web/`)

#### Articles

| Component           | File                               | Description                     |
| ------------------- | ---------------------------------- | ------------------------------- |
| `BlogContent`       | `articles/blog-content.tsx`        | Blog post reader with BlockNote |
| `BlocknoteRender`   | `articles/blocknote-render.tsx`    | BlockNote content renderer      |
| `FeaturedBlogsGrid` | `articles/featured-blogs-grid.tsx` | Featured posts grid             |
| `AllBlogsList`      | `articles/all-blogs-list.tsx`      | Article listing                 |
| `AllNewsletterList` | `articles/all-newsletter-list.tsx` | Newsletter listing              |
| `BlogSkeleton`      | `articles/blog-skeleton.tsx`       | Loading skeleton                |

#### Navigation

| Component    | File                    | Description        |
| ------------ | ----------------------- | ------------------ |
| `Appbar`     | `navbar/Appbar.tsx`     | Header navigation  |
| `Navigation` | `navbar/navigation.tsx` | Nav items          |
| `NavButton`  | `navbar/nav-button.tsx` | Navigation buttons |
| `Footer`     | `footer/Footer.tsx`     | Site footer        |

#### Newsletter

| Component               | File                                    | Description       |
| ----------------------- | --------------------------------------- | ----------------- |
| `NewsletterSubscribe`   | `newsletter/newsletter-subscribe.tsx`   | Subscription form |
| `NewsletterUnsubscribe` | `newsletter/newsletter-unsubscribe.tsx` | Unsubscribe form  |

#### Posts

| Component      | File                     | Description          |
| -------------- | ------------------------ | -------------------- |
| `Post`         | `posts/Post.tsx`         | Post card            |
| `BaseClient`   | `posts/base-client.tsx`  | Client-side wrapper  |
| `BaseStatic`   | `posts/base-static.tsx`  | Static wrapper       |
| `GradientText` | `posts/GradientText.tsx` | Gradient text effect |

#### Pages

| Component       | File                       | Description          |
| --------------- | -------------------------- | -------------------- |
| `Landing`       | `landing/landing.tsx`      | Hero landing section |
| `About`         | `about/about.tsx`          | About page content   |
| `Projects`      | `projects/projects.tsx`    | Portfolio projects   |
| `Library`       | `library/library.tsx`      | Resource library     |
| `Uses`          | `uses/uses.tsx`            | Tech stack display   |
| `LinkComponent` | `links/link-component.tsx` | Bio links page       |
| `Contact`       | `contact/contact.tsx`      | Contact form         |
| `Reminder`      | `reminder/reminder.tsx`    | Reminder feature     |

#### Utilities

| Component         | File                            | Description           |
| ----------------- | ------------------------------- | --------------------- |
| `CommandBar`      | `command/CommandBar.tsx`        | kbar command palette  |
| `GoogleAnalytics` | `analytics/GoogleAnalytics.tsx` | Analytics integration |
| `PostHogProvider` | `posthog-providers/`            | PostHog setup         |
| `ErrorPage`       | `error-page/`                   | Error display         |

### Custom Components (`components/`)

| Component              | File                         | Description         |
| ---------------------- | ---------------------------- | ------------------- |
| `MarkdownEditor`       | `markdown-editor.tsx`        | Rich text editor    |
| `TimePicker`           | `time-picker.tsx`            | Time selection      |
| `DatePicker`           | `date-picker.tsx`            | Date selection      |
| `CalloutBlock`         | `callout-block.tsx`          | Info/alert callouts |
| `SingleImageDropzone`  | `single-image-dropzone.tsx`  | Image upload zone   |
| `UploadImageComponent` | `upload-image-component.tsx` | S3 image uploader   |
| `YouTubeBlocknote`     | `youtube-blocknote.tsx`      | YouTube embed       |
| `CustomSignIn`         | `custom-sign-in.tsx`         | Clerk sign-in       |
| `Divider`              | `divider.tsx`                | Horizontal divider  |
| `Spinner`              | `spinner.tsx`                | Loading spinner     |
| `ThemeProvider`        | `theme-provider.tsx`         | Theme context       |

### Common Utilities (`components/common/`)

| Component             | File                        | Description                   |
| --------------------- | --------------------------- | ----------------------------- |
| `BlocknoteToMarkdown` | `blocknote-to-markdown.tsx` | Convert BlockNote to markdown |
| `EmailTemplate`       | `email-template.tsx`        | Email HTML generator          |
| `PaginationBar`       | `pagination-bar.tsx`        | Pagination UI                 |

## Usage Examples

```typescript
// Import base components
import { Button, Card, Dialog } from "@repo/ui/components/ui";

// Import web components
import { BlogContent } from "@repo/ui/components/web/articles";
import { Appbar, Footer } from "@repo/ui/components/web";

// Use in JSX
<Button variant="default">Click me</Button>

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## Dependencies

- `@radix-ui/*` - Accessibility primitives
- `@blocknote/react` - Rich editor
- `@mantine/core` - Design system
- `lucide-react` - Icons
- `framer-motion` - Animations
- `sonner` - Toast notifications
- `react-markdown` - Markdown rendering
- `kbar` - Command palette

## Environment Variables

Components may require:

```env
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```
