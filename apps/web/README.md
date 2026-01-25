# Web Application

The main public-facing website for deepshaswat.com built with Next.js 14+ and Tailwind CSS.

## Features

- Modern, responsive design
- Server-side rendering with Next.js
- Rich content management
- Newsletter functionality
- Blog system with dynamic content
- Newsletter system with Resend
- Command palette navigation (kbar)
- Dark/light theme support
- SEO optimized with sitemaps and RSS

## Directory Structure

```
web/
├── app/
│   ├── (pages)/           # Route groups for pages
│   ├── api/               # API routes
│   ├── feed.xml/          # RSS feed
│   ├── news-sitemap.xml/  # News sitemap
│   └── sitemap.ts         # Sitemap generation
├── components/            # App-specific components
├── lib/                   # Utilities and helpers
├── public/                # Static assets
└── styles/                # Global styles
```

## Pages & Routes

| Route          | Component               | Description                             |
| -------------- | ----------------------- | --------------------------------------- |
| `/`            | `Landing`               | Hero landing page with featured content |
| `/articles`    | `AllBlogsList`          | Blog listing with pagination            |
| `/newsletter`  | `AllNewsletterList`     | Newsletter archive and subscription     |
| `/[postUrl]`   | `BlogContent`           | Individual blog post reader             |
| `/about`       | `About`                 | Personal about page                     |
| `/projects`    | `Projects`              | Portfolio showcase                      |
| `/library`     | `Library`               | Resource collection                     |
| `/uses`        | `Uses`                  | Tech stack and tools                    |
| `/links`       | `LinkComponent`         | Social and bio links                    |
| `/contact`     | `Contact`               | Contact form                            |
| `/unsubscribe` | `NewsletterUnsubscribe` | Newsletter unsubscribe                  |

## Key Components

| Component             | File                                 | Description                         |
| --------------------- | ------------------------------------ | ----------------------------------- |
| `Appbar`              | `@repo/ui/components/web/navbar`     | Navigation header with theme toggle |
| `Footer`              | `@repo/ui/components/web/footer`     | Site footer with links              |
| `BlogContent`         | `@repo/ui/components/web/articles`   | Renders blog posts with BlockNote   |
| `FeaturedBlogsGrid`   | `@repo/ui/components/web/articles`   | Featured posts showcase grid        |
| `NewsletterSubscribe` | `@repo/ui/components/web/newsletter` | Email subscription form             |
| `CommandBar`          | `@repo/ui/components/web/command`    | kbar command palette                |
| `ScrollProgress`      | `components/`                        | Reading progress indicator          |

## API Routes

| Endpoint            | Method | Description             |
| ------------------- | ------ | ----------------------- |
| `/feed.xml`         | GET    | RSS feed generation     |
| `/news-sitemap.xml` | GET    | News sitemap for Google |
| `/sitemap.xml`      | GET    | Full sitemap generation |

## Development

```bash
# Navigate to the web app
cd apps/web

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

```env
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
DATABASE_URL=
```

## Building for Production

```bash
pnpm build
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/).

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
