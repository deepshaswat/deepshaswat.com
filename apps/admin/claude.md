# Admin App - Claude Memory

## What This App Is

The **Admin App** is the CMS dashboard for content creation and management. It provides a Notion-style editor for writing blog posts and newsletters, member management, and content organization. Protected by Clerk authentication.

**Development Port:** 3001

## What Has Been Done

### Post Management

- Create new posts with rich text editor
- Edit existing posts
- Save as draft or publish immediately
- Schedule posts for future publishing
- Toggle featured status
- Archive and delete posts
- SEO metadata editing (OG tags, Twitter cards)
- Tag assignment

### Newsletter Management

- Create newsletters (special post type)
- Send to all subscribers via Resend
- View newsletter history

### Member Management

- View all newsletter subscribers
- Add new members manually
- Track subscription status
- Handle unsubscribes

### Tag Management

- Create and edit tags
- Assign tags to posts
- View posts by tag

### Editor Features

- BlockNote rich text editor (Notion-style)
- Image upload to S3
- YouTube embed support
- Callout blocks
- Code blocks with syntax highlighting
- Preview mode

## Directory Structure

```
apps/admin/
├── app/
│   ├── (posts)/
│   │   ├── posts/              # All posts listing
│   │   ├── new-post/           # Create new post
│   │   ├── editor/[id]/        # Edit post
│   │   ├── published/          # Published posts
│   │   ├── drafts/             # Draft posts
│   │   ├── scheduled-posts/    # Scheduled posts
│   │   └── newsletters/        # Newsletter management
│   ├── tags/
│   │   ├── page.tsx            # All tags
│   │   ├── new-tag/            # Create tag
│   │   └── [slug]/             # Edit tag
│   ├── members/                # Member management
│   ├── api/
│   │   ├── upload/             # S3 image upload
│   │   └── cron/               # Scheduled publishing
│   ├── sign-in/                # Clerk sign-in
│   └── sign-up/                # Clerk sign-up
├── components/
│   ├── editor/                 # Editor components
│   ├── posts/                  # Post management UI
│   └── tags/                   # Tag management UI
└── middleware.ts               # Auth middleware
```

## Restrictions

- Requires Clerk authentication
- Only users with proper roles can access (ADMIN, OWNER, WRITER)
- Image uploads limited by S3 bucket policies
- Scheduled publishing depends on cron job at `/api/cron/publish-scheduled`
- All data mutations through `@repo/actions`

## What Needs To Be Done

- [ ] Email preview before sending newsletters
- [ ] Draft auto-save functionality
- [ ] Post version history and rollback
- [ ] Collaborative editing support
- [ ] Bulk operations (select multiple posts)
- [ ] Analytics dashboard
- [ ] Member segmentation for targeted sends
- [ ] Import/export posts
- [ ] Media library for managing uploads
- [ ] Custom email templates UI

## Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
AWS_REGION=
CRON_SECRET=
```

## Key Dependencies

- `@repo/ui` - Shared components
- `@repo/actions` - Server actions
- `@repo/store` - Recoil state
- `@repo/db` - Database client
- `@blocknote/react` - Rich text editor
- `@clerk/nextjs` - Authentication
