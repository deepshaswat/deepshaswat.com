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
  _Enhancements are still in progress_.
  [Link to demo](https://youtu.be/WCVI4_IB_6E)

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

## 📋 Configuration Todo List

### Required Environment Variables

The following environment variables need to be configured for full functionality:

#### Core Services (Required)

| Variable                            | Description               | How to Get                                                     |
| ----------------------------------- | ------------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`                      | MongoDB connection string | [MongoDB Atlas](https://www.mongodb.com/atlas) or DigitalOcean |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key          | [Clerk Dashboard](https://dashboard.clerk.com)                 |
| `CLERK_SECRET_KEY`                  | Clerk secret key          | [Clerk Dashboard](https://dashboard.clerk.com)                 |
| `RESEND_API_KEY`                    | Resend API key for emails | [Resend Dashboard](https://resend.com/api-keys)                |
| `RESEND_AUDIENCE_ID`                | Resend audience ID        | [Resend Audiences](https://resend.com/audiences)               |

#### Storage (Required)

| Variable                | Description                  | How to Get                                                |
| ----------------------- | ---------------------------- | --------------------------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS access key               | [AWS IAM Console](https://console.aws.amazon.com/iam)     |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key               | [AWS IAM Console](https://console.aws.amazon.com/iam)     |
| `AWS_S3_BUCKET_NAME`    | S3 bucket name               | Create in [S3 Console](https://s3.console.aws.amazon.com) |
| `AWS_REGION`            | AWS region (e.g., us-east-1) | Your S3 bucket region                                     |

#### Caching (Required)

| Variable    | Description             | How to Get                                                                                  |
| ----------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| `REDIS_URL` | Redis connection string | [DigitalOcean Managed Redis](https://www.digitalocean.com/products/managed-databases-redis) |

#### Analytics (Optional but Recommended)

| Variable                   | Description             | How to Get                                                    |
| -------------------------- | ----------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`  | PostHog project API key | [PostHog Dashboard](https://app.posthog.com/project/settings) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL        | Usually `https://app.posthog.com`                             |

#### AI Features (Optional - for Idea Generator)

| Variable                         | Description                       | How to Get                                                                     |
| -------------------------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| `GCP_PROJECT_ID`                 | Google Cloud project ID           | [GCP Console](https://console.cloud.google.com)                                |
| `GCP_LOCATION`                   | GCP region (default: us-central1) | [Vertex AI Regions](https://cloud.google.com/vertex-ai/docs/general/locations) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON      | See setup below                                                                |

### AI Features Setup (Vertex AI)

To enable AI-powered features (topic suggestions, trending analysis, script generation, image generation):

1. **Create a GCP Project**

   ```bash
   # Install gcloud CLI if not installed
   # https://cloud.google.com/sdk/docs/install

   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```

2. **Enable Vertex AI API**

   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

3. **Create Service Account**

   ```bash
   gcloud iam service-accounts create vertex-ai-sa \
     --display-name="Vertex AI Service Account"

   gcloud projects add-iam-policy-binding your-project-id \
     --member="serviceAccount:vertex-ai-sa@your-project-id.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"

   gcloud iam service-accounts keys create ./vertex-ai-key.json \
     --iam-account=vertex-ai-sa@your-project-id.iam.gserviceaccount.com
   ```

4. **Set Environment Variables**

   ```bash
   GCP_PROJECT_ID=your-project-id
   GCP_LOCATION=us-central1
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/vertex-ai-key.json
   ```

5. **Enable Imagen API (for image generation)**
   - Go to [Vertex AI Console](https://console.cloud.google.com/vertex-ai)
   - Navigate to "Model Garden"
   - Find and enable "Imagen" model

### Cron Job Setup (for Scheduled Posts)

Set up a cron job to publish scheduled posts:

```bash
# Call this endpoint every minute
curl -X POST https://your-admin-domain.com/api/cron/publish-scheduled \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Add to your environment:

```
CRON_SECRET=your-secure-cron-secret
```

### Deployment Checklist

- [ ] Configure all required environment variables
- [ ] Set up MongoDB database
- [ ] Set up Redis cache
- [ ] Create S3 bucket with CORS configuration
- [ ] Set up Clerk authentication
- [ ] Configure Resend for emails
- [ ] (Optional) Set up PostHog analytics
- [ ] (Optional) Set up Vertex AI for AI features
- [ ] Set up cron job for scheduled posts
- [ ] Configure domain and DNS
- [ ] Set up SSL certificates

### Feature Status

| Feature              | Status   | Config Required             |
| -------------------- | -------- | --------------------------- |
| Blog Editor          | ✅ Ready | Core services               |
| Newsletter Sending   | ✅ Ready | Resend                      |
| Image Upload         | ✅ Ready | AWS S3                      |
| Member Management    | ✅ Ready | Core services               |
| Scheduled Posts      | ✅ Ready | Cron job                    |
| Analytics            | ✅ Ready | PostHog (optional)          |
| AI Topic Discovery   | ✅ Ready | Vertex AI (optional)        |
| AI Outline Generator | ✅ Ready | Vertex AI (optional)        |
| AI Script Generator  | ✅ Ready | Vertex AI (optional)        |
| AI Image Generator   | ✅ Ready | Vertex AI Imagen (optional) |

## 📝 License

MIT
