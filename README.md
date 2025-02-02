# deepshaswat.com - Modern Newsletter Platform

This is a modern newsletter platform with custom CMS to create and manage blogs,
newsletters and members with Notion style text editor built with Turborepo,
Next.js, and various other cutting-edge technologies. The project uses a
monorepo structure to manage multiple applications and shared packages.

## 🚀 Tech Stack

- [Turborepo](https://turbo.build/repo) - High-performance build system
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [AceternityUI](https://ui.aceternity.com/components) - Modern animated
  components
- [Recoil](https://recoiljs.org/) - State management
- [Clerk](https://clerk.com/) - Authentication
- [Resend](https://resend.com/home) - Modern way of sending email
- [Digital Ocean](https://www.digitalocean.com/) - New age managed services.
  Using for redis, mongodb etc.
- [PostHog](https://posthog.com/) - Best tool for analytics and best free tier.
- [AWS](https://aws.amazon.com/) - Suing S3 bucket here to store all the media

## 📦 Project Structure

### Apps

- `web/` - Blog site with personal website. Newsletter page with option to
  subscribe [Live here](https://deepshaswat.com/)
- `admin/` - Admin site with create blogs, newsletter and user management.
  _Enhancements are still in progress_. [Link to demo]()

### Packages

- `actions/` - Shared business logic and API actions
- `db/` - Database client and schema definitions
- `ui/` - Shared UI component library
- `store/` - State management and data stores
- `schema/` - Shared type definitions and schemas
- `config-tailwind/` - Shared Tailwind configuration
- `config-typescript/` - Shared TypeScript configurations
- `config-eslint/` - Shared ESLint configurations

## 🛠️ Development

### Prerequisites

- Node.js >= 16
- Yarn
- MongoDB (for Prisma)

### Getting Started

1. Clone the repository:

```bash
git clone https://github.com/deepshaswat/deepshaswat.com.git
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
yarn dev
```

## 🏗️ Building

```bash
yarn build
```

## 🧪 Testing

```bash
yarn test
```

## 📚 Additional Resources

- [MultiSelect Component](https://nyxbui.design/docs/components/multi-select)
- [Fusion UI Components](https://nyxbui.design/docs/components/accordion)

## 📝 License

MIT
