# deepshaswat.com - Project Memory

## What This Project Is

**deepshaswat.com** is a modern newsletter platform with a custom CMS built as a monorepo. It powers a personal blog and newsletter service with a Notion-style editor, allowing content creation, management, and distribution to subscribers.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Turborepo** | Monorepo build system |
| **Next.js 14** | Frontend framework (App Router) |
| **Prisma 5.13** | ORM for MongoDB |
| **MongoDB** | Database |
| **Clerk** | Authentication |
| **Resend** | Email & newsletter delivery |
| **PostHog** | Analytics |
| **AWS S3** | Media storage |
| **Redis** | Caching (DigitalOcean) |
| **BlockNote** | Rich text editor |
| **Tailwind CSS** | Styling |
| **Shadcn/ui** | Component library |

## Architecture Overview

```
deepshaswat.com/
├── apps/
│   ├── web/          # Public-facing website (port 3000)
│   └── admin/        # CMS dashboard (port 3001)
├── packages/
│   ├── db/           # Prisma client & Redis
│   ├── actions/      # Server actions & business logic
│   ├── ui/           # Shared React components
│   ├── schema/       # Zod validation schemas
│   ├── store/        # Recoil state atoms
│   ├── config-tailwind/    # Shared Tailwind config
│   ├── config-typescript/  # Shared TypeScript config
│   └── config-eslint/      # Shared ESLint config
└── turbo.json        # Turborepo configuration
```

## Data Flow

```
User (Web/Admin)
  ↓
Next.js App (Client)
  ↓
Server Actions (actions package)
  ↓
Prisma Client + MongoDB
  ↓
Redis Cache Layer
  ↓
Email Delivery (Resend) / Storage (S3)
```

## What Has Been Done

### Core Features (Completed)
- Blog creation and editing with Notion-style BlockNote editor
- Newsletter management and sending via Resend
- Member subscription management
- Post scheduling with cron-based publishing
- Tag management system
- SEO optimization with comprehensive metadata
- Redis caching for blog content
- Dark/light theme support
- Command palette (kbar) for quick navigation
- RSS feed generation
- Sitemap generation for SEO
- PostHog analytics integration
- AWS S3 image uploads
- Contact form with email notifications

### Admin Features (Completed)
- Post CRUD operations (create, read, update, delete)
- Draft/Published/Scheduled post states
- Featured post management
- Tag creation and assignment
- Member management (add, view, unsubscribe)
- Role-based access (ADMIN, OWNER, WRITER)

### Web Features (Completed)
- Landing page
- Blog/Articles listing
- Newsletter subscription
- Individual post reader with BlockNote rendering
- About, Projects, Library, Uses, Links pages
- Contact form
- Unsubscribe functionality

## Restrictions & Constraints

### Technical Constraints
- MongoDB only (no SQL databases)
- Clerk for authentication (no custom auth)
- Resend for emails (rate limits apply)
- Redis caching requires DigitalOcean managed Redis

### Code Patterns to Follow
- Server actions in `packages/actions` for all data mutations
- Shared components in `packages/ui`
- State management via Recoil atoms in `packages/store`
- Zod schemas for validation in `packages/schema`
- All database access through Prisma client in `packages/db`

### Environment Variables Required
```
# Database
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Resend
RESEND_API_KEY=
RESEND_AUDIENCE_ID=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
AWS_REGION=

# Redis
REDIS_URL=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## What Needs To Be Done

### Pending Features
- [ ] Email template customization UI
- [ ] Analytics dashboard in admin
- [ ] Member segmentation for targeted newsletters
- [ ] A/B testing for email subject lines
- [ ] Commenting system for blog posts
- [ ] Social sharing optimization
- [ ] Email preview before sending
- [ ] Bulk post operations (archive, delete)
- [ ] Post version history
- [ ] Collaborative editing

### Technical Debt
- [ ] Add comprehensive test coverage
- [ ] Implement proper error boundaries
- [ ] Add loading states for all async operations
- [ ] Optimize image loading with blur placeholders
- [ ] Add rate limiting for API routes

### Performance Improvements
- [ ] Implement ISR for frequently accessed pages
- [ ] Add CDN for static assets
- [ ] Optimize database queries with proper indexing
- [ ] Implement connection pooling for high traffic

## Commands

```bash
# Development
pnpm dev           # Start all apps in dev mode
pnpm build         # Build all apps
pnpm lint          # Run ESLint
pnpm type-check    # TypeScript type checking
pnpm clean         # Clean build artifacts

# Database
pnpm db:generate   # Generate Prisma client
pnpm db:push       # Push schema to database
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `apps/web/app/page.tsx` | Landing page |
| `apps/admin/app/(posts)/editor/[id]/page.tsx` | Post editor |
| `packages/actions/src/admin/crud-posts.ts` | Post CRUD operations |
| `packages/actions/src/common/resend.ts` | Email sending logic |
| `packages/db/prisma/schema.prisma` | Database schema |
| `packages/ui/src/components/web/articles/blog-content.tsx` | Blog reader |
| `packages/store/src/atoms/post.ts` | Post state atoms |
