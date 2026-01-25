# Web App - Claude Memory

## What This App Is

The **Web App** is the public-facing website for deepshaswat.com. It serves the blog, newsletter subscription, and static pages to visitors. Built with Next.js 14 App Router, it provides a fast, SEO-optimized reading experience.

**Production URL:** https://deepshaswat.com
**Development Port:** 3000

## What Has Been Done

### Pages Implemented
- **Landing Page** (`/`) - Hero section with featured content
- **Articles** (`/articles`) - Blog listing with pagination
- **Newsletter** (`/newsletter`) - Newsletter listing and subscription
- **Post Reader** (`/[postUrl]`) - Individual blog post with BlockNote rendering
- **About** (`/about`) - Personal about page
- **Projects** (`/projects`) - Portfolio showcase
- **Library** (`/library`) - Resource collection
- **Uses** (`/uses`) - Tech stack and tools
- **Links** (`/links`) - Social and bio links
- **Contact** (`/contact`) - Contact form
- **Unsubscribe** (`/unsubscribe`) - Newsletter unsubscribe
- **Investing** (`/investing`) - Investment content
- **Reminder** (`/reminder`) - Reminder functionality

### SEO Features
- Dynamic sitemap generation (`sitemap.ts`)
- News sitemap (`news-sitemap.xml/route.ts`)
- RSS feed (`feed.xml/route.ts`)
- robots.txt configuration
- Open Graph and Twitter card metadata
- Canonical URLs

### Integrations
- PostHog analytics
- Google Analytics
- Command palette (kbar) for navigation
- Theme support (dark/light)
- Redis caching for blog content

## Directory Structure

```
apps/web/
├── app/
│   ├── (pages)/           # Route groups for pages
│   │   ├── (article)/[postUrl]/  # Dynamic blog post route
│   │   ├── articles/
│   │   ├── newsletter/
│   │   ├── about/
│   │   ├── projects/
│   │   ├── library/
│   │   ├── uses/
│   │   ├── links/
│   │   ├── contact/
│   │   ├── unsubscribe/
│   │   └── ...
│   ├── api/               # API routes
│   ├── feed.xml/          # RSS feed
│   ├── news-sitemap.xml/  # News sitemap
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── sitemap.ts         # Sitemap generation
├── components/            # App-specific components
├── lib/                   # Utilities and helpers
├── public/                # Static assets
└── styles/                # Global styles
```

## Restrictions

- No direct database access - use `@repo/actions` for data fetching
- Blog content cached in Redis - changes require cache invalidation
- Images served via S3 - no local image storage
- Authentication not required for public pages
- Rate limiting on contact form submissions

## What Needs To Be Done

- [ ] Implement search functionality for blog posts
- [ ] Add reading time estimates
- [ ] Implement related posts suggestions
- [ ] Add social sharing buttons
- [ ] Implement commenting system
- [ ] Add newsletter archive browsing
- [ ] Optimize images with next/image blur placeholders
- [ ] Add progressive web app (PWA) support
- [ ] Implement offline reading mode
- [ ] Add print-friendly stylesheets

## Environment Variables

```
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

## Key Dependencies

- `@repo/ui` - Shared components
- `@repo/actions` - Server actions
- `@repo/store` - Recoil state
- `@blocknote/react` - Blog content rendering
- `kbar` - Command palette
- `next-themes` - Theme support
