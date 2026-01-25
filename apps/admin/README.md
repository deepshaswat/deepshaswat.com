# Admin Dashboard

Administrative dashboard for deepshaswat.com built with Next.js 14+ and Tailwind CSS. Provides content management, newsletter sending, and member management.

## Features

- Secure authentication with Clerk
- Notion-style BlockNote editor
- Post scheduling and publishing
- Newsletter management and sending
- Member subscription management
- Tag management
- SEO metadata editing
- Image upload to AWS S3

## Directory Structure

```
admin/
├── app/
│   ├── (posts)/           # Post management routes
│   ├── tags/              # Tag management
│   ├── members/           # Member management
│   ├── api/               # API routes
│   ├── sign-in/           # Clerk authentication
│   └── sign-up/
├── components/
│   ├── editor/            # Editor components
│   ├── posts/             # Post management UI
│   └── tags/              # Tag management UI
└── middleware.ts          # Auth middleware
```

## Pages & Routes

| Route              | Component               | Description                   |
| ------------------ | ----------------------- | ----------------------------- |
| `/posts`           | `PostsTableRender`      | View all posts with filtering |
| `/new-post`        | `NewPostPage`           | Create new post               |
| `/editor/[id]`     | `EditPostComponent`     | Edit existing post            |
| `/published`       | `PostsTableRender`      | View published posts          |
| `/drafts`          | `PostsTableRender`      | View draft posts              |
| `/scheduled-posts` | `PostsTableRender`      | View scheduled posts          |
| `/newsletters`     | `PostsTableRender`      | Manage newsletters            |
| `/tags`            | `TagComponentRendering` | View all tags                 |
| `/tags/new-tag`    | `TagComponent`          | Create new tag                |
| `/tags/[slug]`     | `EditComponent`         | Edit tag                      |
| `/members`         | `MembersPage`           | Manage subscribers            |

## Key Components

| Component                | File                                            | Description                            |
| ------------------------ | ----------------------------------------------- | -------------------------------------- |
| `EditPostComponent`      | `components/editor/edit-post-component.tsx`     | Main post editor with metadata sidebar |
| `MarkdownEditor`         | `components/editor/markdown-editor.tsx`         | BlockNote rich text editor             |
| `MetadataSidebar`        | `components/editor/metadata-sidebar.tsx`        | SEO metadata editor                    |
| `PostsTableRender`       | `components/posts/posts-table-render.tsx`       | Posts listing table                    |
| `PostFilterNavbar`       | `components/posts/post-filter-navbar.tsx`       | Filtering and sorting controls         |
| `PublishDialogComponent` | `components/posts/publish-dialog-component.tsx` | Publish settings dialog                |
| `TagComponent`           | `components/tags/tag-component.tsx`             | Tag creation/editing                   |
| `UploadImageComponent`   | `@repo/ui/components`                           | S3 image uploader                      |

## API Routes

| Endpoint                      | Method | Description                       |
| ----------------------------- | ------ | --------------------------------- |
| `/api/upload`                 | POST   | Upload images to S3               |
| `/api/cron/publish-scheduled` | POST   | Cron job for scheduled publishing |

## Server Actions Used

| Action                    | Package                | Description                    |
| ------------------------- | ---------------------- | ------------------------------ |
| `createPost`              | `@repo/actions/admin`  | Create new post                |
| `updatePost`              | `@repo/actions/admin`  | Update existing post           |
| `deletePost`              | `@repo/actions/admin`  | Soft delete post               |
| `fetchAllPosts`           | `@repo/actions/admin`  | Get posts with filters         |
| `createMember`            | `@repo/actions/admin`  | Add newsletter subscriber      |
| `createTag`               | `@repo/actions/admin`  | Create new tag                 |
| `sendBroadcastNewsletter` | `@repo/actions/common` | Send newsletter to all members |

## Development

```bash
# Navigate to the admin app
cd apps/admin

# Start the development server
pnpm dev
```

The application will be available at `http://localhost:3001`

## Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
AWS_REGION=
DATABASE_URL=
CRON_SECRET=
```

## Security

- Protected routes with Clerk authentication
- Role-based access control (ADMIN, OWNER, WRITER)
- Secure API endpoints
- Middleware-based route protection

## Building for Production

```bash
pnpm build
```

## Access Control

The admin dashboard is restricted to authorized personnel only. Contact the system administrator for access.
