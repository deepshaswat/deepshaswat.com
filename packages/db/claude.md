# Database Package - Claude Memory

## What This Package Is

The **db package** provides the database client and connection management for the entire monorepo. It exports a singleton Prisma client for MongoDB and a Redis client for caching.

## What Has Been Done

### Prisma Client
- Singleton pattern to prevent connection pool exhaustion in Next.js
- MongoDB datasource configuration
- Full schema with all models

### Redis Client
- Connection to DigitalOcean managed Redis
- Error handling and connection management
- Used for blog content caching

### Database Models

| Model | Purpose |
|-------|---------|
| `ContactForm` | Contact form submissions |
| `Post` | Blog posts and newsletters |
| `Tag` | Content categorization |
| `TagOnPost` | Many-to-many relationship |
| `Author` | Content creators (Clerk integration) |
| `Member` | Newsletter subscribers |

### Post Model Features
- Status management (DRAFT, PUBLISHED, SCHEDULED, ARCHIVED, DELETED)
- Newsletter type support (PERSONAL, COMPANY)
- SEO metadata fields (og, twitter, canonical)
- Featured post flag
- Scheduled publishing with publishDate
- View count tracking

### Indexes
- `featured` - For featured posts queries
- `publishDate` - For scheduled post queries
- `status` - For filtering by status
- `title` - For search
- `createdAt` - For sorting

## Directory Structure

```
packages/db/
├── src/
│   ├── index.ts      # Prisma client singleton
│   └── redis.ts      # Redis client
├── prisma/
│   └── schema.prisma # Database schema
└── package.json
```

## Exports

```typescript
// Prisma client
import prisma from "@repo/db/client";

// Redis client
import { redis } from "@repo/db/redis";
```

## Restrictions

- MongoDB only - no SQL database support
- Prisma client must be imported from this package (not instantiated elsewhere)
- Redis connection requires REDIS_URL environment variable
- Schema changes require `pnpm db:generate` and `pnpm db:push`

## What Needs To Be Done

- [ ] Add database migrations strategy
- [ ] Implement soft delete across all models
- [ ] Add audit logging for changes
- [ ] Optimize indexes based on query patterns
- [ ] Add connection pooling for high traffic
- [ ] Implement read replicas support
- [ ] Add database backup automation

## Environment Variables

```
DATABASE_URL=mongodb+srv://...
REDIS_URL=rediss://...
```

## Key Types

```typescript
// Post statuses
enum PostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
  DELETED
}

// Newsletter types
enum NewsletterType {
  PERSONAL
  COMPANY
}

// User roles
enum Role {
  ADMIN
  OWNER
  WRITER
}
```
