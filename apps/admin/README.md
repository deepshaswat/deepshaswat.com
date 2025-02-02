# Admin Dashboard

Administrative dashboard for deepshaswat.com built with Next.js 14+ and Tailwind
CSS.

## Features

- Secure authentication system
- Content management interface
- Newsletter management
- User management
- Analytics dashboard
- Post editor with rich text support
- Media management
- Authentication with Clerk

## Directory Structure

```
admin/
├── app/           # Next.js 13+ app directory
├── public/        # Static assets
└── components/    # React components
```

## Development

1. Navigate to the admin app directory:

```bash
cd apps/admin
```

2. Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3001`

## Environment Variables

Ensure the following environment variables are set in your `.env` file:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## Security

- Protected routes with authentication
- Role-based access control
- Secure API endpoints
- Session management

## Building for Production

```bash
yarn build
```

## Testing

```bash
yarn test
```

## Access Control

The admin dashboard is restricted to authorized personnel only. Contact the
system administrator for access.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the
result.

You can start editing the page by modifying `src/app/page.tsx`. The page
auto-updates as you edit the file.

To create
[API routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers)
add an `api/` directory to the `app/` directory with a `route.ts` file. For
individual endpoints, create a subfolder in the `api` directory, like
`api/hello/route.ts` would map to
[http://localhost:3001/api/hello](http://localhost:3001/api/hello).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn/foundations/about-nextjs) - an
  interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js/) - your
feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_source=github.com&utm_medium=referral&utm_campaign=turborepo-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/deployment) for more
details.
