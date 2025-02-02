# Web Application

The main public-facing website for deepshaswat.com built with Next.js 14+ and
Tailwind CSS.

## Features

- Modern, responsive design
- Server-side rendering with Next.js
- Rich content management
- Newsletter functionality
- Blog system with dynamic content
- Newsletter system with Resend
- Optimized for performance

## Directory Structure

```
web/
├── app/           # Next.js 13+ app directory
├── public/        # Static assets
└── components/    # React components
```

## Development

1. Navigate to the web app directory:

```bash
cd apps/web
```

2. Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

Ensure the following environment variables are set in your `.env` file:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Building for Production

```bash
yarn build
```

## Testing

```bash
yarn test
```

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `src/app/page.tsx`. The page
auto-updates as you edit the file.

To create
[API routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers)
add an `api/` directory to the `app/` directory with a `route.ts` file. For
individual endpoints, create a subfolder in the `api` directory, like
`api/hello/route.ts` would map to
[http://localhost:3000/api/hello](http://localhost:3000/api/hello).

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
