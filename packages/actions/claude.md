# Actions Package - Claude Memory

## What This Package Is

The **actions package** contains all server-side business logic as Next.js Server Actions. It centralizes data mutations, email sending, caching, and CRUD operations for both the web and admin apps.

## What Has Been Done

### Admin Actions (`src/admin/`)

#### Post Operations (`crud-posts.ts`)

- `createPost()` - Create new post with metadata
- `updatePost()` - Update existing post
- `deletePost()` - Soft delete post
- `publishPost()` - Publish scheduled post
- `archivePost()` - Archive post

#### Post Fetching (`fetch-posts.ts`)

- `fetchAllPosts()` - Get posts with filtering
- `fetchAllPostsCount()` - Get post count
- `fetchPostById()` - Get single post
- `fetchPostByUrl()` - Get post by URL slug
- `fetchFeaturedPosts()` - Get featured posts
- `fetchPostsByTag()` - Filter by tag

#### Member Operations (`crud-member.ts`)

- `createMember()` - Add newsletter subscriber
- `fetchAllMembers()` - Get all members
- `updateMemberStatus()` - Update subscription
- `unsubscribeMember()` - Handle unsubscribe

#### Tag Operations (`crud-tags.ts`)

- `createTag()` - Create new tag
- `updateTag()` - Update tag
- `deleteTag()` - Delete tag
- `fetchAllTags()` - Get all tags

#### Author Operations (`author.ts`)

- `getOrCreateAuthor()` - Get/create author from Clerk

### Web Actions (`src/web/`)

#### Contact (`contact.ts`)

- `submitContactForm()` - Process contact submissions

#### Cache (`redis-client.ts`)

- `invalidateCache()` - Clear Redis cache
- `getFromCache()` - Retrieve cached data
- `setCache()` - Store in cache

### Common Utilities (`src/common/`)

#### Email (`resend.ts`)

- `sendEmail()` - Send single email
- `sendNewsletter()` - Send to one subscriber
- `sendBroadcastNewsletter()` - Send to all subscribers
- `addContactToAudience()` - Add to Resend audience

#### Revalidation (`revalidate.ts`)

- `revalidatePaths()` - Invalidate Next.js cache

#### Types (`types.ts`)

- `PostType` - Full post interface
- `PostListType` - Post list item interface
- `Tags` - Tag interface
- `Member` - Member interface
- `AuthorType` - Author interface

## Directory Structure

```
packages/actions/
├── src/
│   ├── admin/
│   │   ├── crud-posts.ts
│   │   ├── crud-member.ts
│   │   ├── crud-tags.ts
│   │   ├── fetch-posts.ts
│   │   ├── author.ts
│   │   └── date-time.ts
│   ├── web/
│   │   ├── contact.ts
│   │   └── redis-client.ts
│   └── common/
│       ├── types.ts
│       ├── resend.ts
│       └── revalidate.ts
└── package.json
```

## Restrictions

- All functions are server-side only ("use server")
- Must handle Prisma errors gracefully
- Email sending rate limited by Resend
- Cache invalidation required after data changes
- No direct database imports - use `@repo/db/client`

## What Needs To Be Done

- [ ] Add proper error handling with error codes
- [ ] Implement retry logic for email failures
- [ ] Add rate limiting for actions
- [ ] Implement batch operations
- [ ] Add action logging/audit trail
- [ ] Implement optimistic updates support
- [ ] Add input validation with Zod
- [ ] Implement pagination cursors for large datasets

## Environment Variables

```
DATABASE_URL=
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
REDIS_URL=
```

## Usage Examples

```typescript
// Fetch posts
import { fetchAllPosts } from "@repo/actions/admin/fetch-posts";
const posts = await fetchAllPosts({ status: "PUBLISHED", page: 1 });

// Send newsletter
import { sendBroadcastNewsletter } from "@repo/actions/common/resend";
await sendBroadcastNewsletter(postId, subject, htmlContent);

// Invalidate cache
import { invalidateCache } from "@repo/actions/web/redis-client";
await invalidateCache("blog:*");
```
