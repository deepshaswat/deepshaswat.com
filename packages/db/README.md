# @repo/db - Database Package

Database client and schema definitions for the deepshaswat.com monorepo using Prisma with MongoDB and Redis caching.

## Installation

This package is internal to the monorepo and available via workspace imports.

```typescript
import prisma from "@repo/db/client";
import { redis } from "@repo/db/redis";
```

## Exports

| Export            | Description              |
| ----------------- | ------------------------ |
| `@repo/db/client` | Prisma client singleton  |
| `@repo/db/redis`  | Redis client for caching |

## Database Schema

### Models

| Model         | Description                        |
| ------------- | ---------------------------------- |
| `Post`        | Blog posts and newsletters         |
| `Tag`         | Content categorization             |
| `TagOnPost`   | Many-to-many post-tag relationship |
| `Author`      | Content creators (Clerk users)     |
| `Member`      | Newsletter subscribers             |
| `ContactForm` | Contact form submissions           |

### Post Model Fields

| Field                | Type           | Description                                    |
| -------------------- | -------------- | ---------------------------------------------- |
| `id`                 | String         | Unique identifier                              |
| `title`              | String         | Post title                                     |
| `postUrl`            | String         | URL slug (unique)                              |
| `content`            | String         | BlockNote JSON content                         |
| `featureImage`       | String         | Featured image URL                             |
| `status`             | PostStatus     | DRAFT, PUBLISHED, SCHEDULED, ARCHIVED, DELETED |
| `featured`           | Boolean        | Featured post flag                             |
| `newsletterType`     | NewsletterType | PERSONAL or COMPANY                            |
| `publishDate`        | DateTime       | Scheduled publish date                         |
| `metaTitle`          | String         | SEO meta title                                 |
| `metaDescription`    | String         | SEO meta description                           |
| `ogTitle`            | String         | Open Graph title                               |
| `ogDescription`      | String         | Open Graph description                         |
| `ogImage`            | String         | Open Graph image                               |
| `twitterTitle`       | String         | Twitter card title                             |
| `twitterDescription` | String         | Twitter card description                       |
| `twitterImage`       | String         | Twitter card image                             |
| `canonicalUrl`       | String         | Canonical URL                                  |
| `views`              | Int            | View count                                     |

### Enums

```typescript
enum PostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
  DELETED
}

enum NewsletterType {
  PERSONAL
  COMPANY
}

enum Role {
  ADMIN
  OWNER
  WRITER
}
```

## Functions

### Prisma Client (`src/index.ts`)

| Function                  | Description                      |
| ------------------------- | -------------------------------- |
| `prisma` (default export) | Singleton Prisma client instance |

### Redis Client (`src/redis.ts`)

| Function | Description                       |
| -------- | --------------------------------- |
| `redis`  | Redis client instance for caching |

## Usage Examples

```typescript
// Fetch all published posts
import prisma from "@repo/db/client";

const posts = await prisma.post.findMany({
  where: { status: "PUBLISHED" },
  orderBy: { publishDate: "desc" },
});

// Cache blog content
import { redis } from "@repo/db/redis";

await redis.set("blog:post-slug", JSON.stringify(postData));
const cached = await redis.get("blog:post-slug");
```

## Environment Variables

```env
DATABASE_URL=mongodb+srv://...
REDIS_URL=rediss://...
```

## Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Open Prisma Studio
pnpm db:studio
```
