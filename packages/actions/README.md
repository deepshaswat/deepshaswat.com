# @repo/actions - Server Actions Package

Shared server-side business logic and Next.js Server Actions for the deepshaswat.com monorepo.

## Installation

This package is internal to the monorepo and available via workspace imports.

```typescript
import { createPost, updatePost } from "@repo/actions/admin/crud-posts";
import { sendNewsletter } from "@repo/actions/common/resend";
```

## Exports

| Export Path                       | Description                |
| --------------------------------- | -------------------------- |
| `@repo/actions/admin/crud-posts`  | Post CRUD operations       |
| `@repo/actions/admin/crud-member` | Member management          |
| `@repo/actions/admin/crud-tags`   | Tag management             |
| `@repo/actions/admin/fetch-posts` | Post fetching with filters |
| `@repo/actions/admin/author`      | Author management          |
| `@repo/actions/admin/date-time`   | Date/time utilities        |
| `@repo/actions/web/contact`       | Contact form submission    |
| `@repo/actions/web/redis-client`  | Cache operations           |
| `@repo/actions/common/resend`     | Email sending              |
| `@repo/actions/common/revalidate` | Cache revalidation         |
| `@repo/actions/common/types`      | TypeScript interfaces      |

## Functions

### Post Operations (`admin/crud-posts.ts`)

| Function      | Parameters     | Description              |
| ------------- | -------------- | ------------------------ |
| `createPost`  | `PostType`     | Create a new post        |
| `updatePost`  | `id, PostType` | Update existing post     |
| `deletePost`  | `id`           | Soft delete a post       |
| `publishPost` | `id`           | Publish a scheduled post |
| `archivePost` | `id`           | Archive a post           |

### Post Fetching (`admin/fetch-posts.ts`)

| Function             | Parameters                | Description           |
| -------------------- | ------------------------- | --------------------- |
| `fetchAllPosts`      | `{ status, page, limit }` | Get paginated posts   |
| `fetchAllPostsCount` | `{ status }`              | Get post count        |
| `fetchPostById`      | `id`                      | Get single post by ID |
| `fetchPostByUrl`     | `postUrl`                 | Get post by URL slug  |
| `fetchFeaturedPosts` | -                         | Get featured posts    |
| `fetchPostsByTag`    | `tagSlug`                 | Filter posts by tag   |

### Member Operations (`admin/crud-member.ts`)

| Function             | Parameters        | Description                |
| -------------------- | ----------------- | -------------------------- |
| `createMember`       | `{ email, name }` | Add newsletter subscriber  |
| `fetchAllMembers`    | `{ page, limit }` | Get paginated members      |
| `updateMemberStatus` | `id, status`      | Update subscription status |
| `unsubscribeMember`  | `email`           | Handle unsubscribe         |

### Tag Operations (`admin/crud-tags.ts`)

| Function       | Parameters                    | Description         |
| -------------- | ----------------------------- | ------------------- |
| `createTag`    | `{ name, slug, description }` | Create new tag      |
| `updateTag`    | `id, TagType`                 | Update existing tag |
| `deleteTag`    | `id`                          | Delete a tag        |
| `fetchAllTags` | -                             | Get all tags        |

### Author Operations (`admin/author.ts`)

| Function            | Parameters    | Description                     |
| ------------------- | ------------- | ------------------------------- |
| `getOrCreateAuthor` | `clerkUserId` | Get or create author from Clerk |

### Email Operations (`common/resend.ts`)

| Function                  | Parameters                | Description             |
| ------------------------- | ------------------------- | ----------------------- |
| `sendEmail`               | `{ to, subject, html }`   | Send single email       |
| `sendNewsletter`          | `memberId, subject, html` | Send to one subscriber  |
| `sendBroadcastNewsletter` | `postId, subject, html`   | Send to all subscribers |
| `addContactToAudience`    | `email, name`             | Add to Resend audience  |

### Cache Operations (`web/redis-client.ts`)

| Function          | Parameters        | Description            |
| ----------------- | ----------------- | ---------------------- |
| `invalidateCache` | `pattern`         | Clear cache by pattern |
| `getFromCache`    | `key`             | Retrieve cached data   |
| `setCache`        | `key, value, ttl` | Store in cache         |

### Contact (`web/contact.ts`)

| Function            | Parameters                 | Description                |
| ------------------- | -------------------------- | -------------------------- |
| `submitContactForm` | `{ email, name, message }` | Process contact submission |

### Revalidation (`common/revalidate.ts`)

| Function          | Parameters | Description              |
| ----------------- | ---------- | ------------------------ |
| `revalidatePaths` | `paths[]`  | Invalidate Next.js cache |

## Types (`common/types.ts`)

| Type           | Description              |
| -------------- | ------------------------ |
| `PostType`     | Full post interface      |
| `PostListType` | Post list item interface |
| `Tags`         | Tag interface            |
| `Member`       | Member interface         |
| `AuthorType`   | Author interface         |

## Usage Examples

```typescript
// Create a new post
import { createPost } from "@repo/actions/admin/crud-posts";

const post = await createPost({
  title: "My Post",
  content: "...",
  status: "DRAFT",
});

// Send newsletter
import { sendBroadcastNewsletter } from "@repo/actions/common/resend";

await sendBroadcastNewsletter(postId, "Subject", htmlContent);
```

## Environment Variables

```env
DATABASE_URL=
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
REDIS_URL=
```
