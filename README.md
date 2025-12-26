# TimeCapsule

A web platform where users create digital "time capsules" containing their future goals. Each capsule can be private or public, has a fixed reveal date, and can include multiple goals with expected completion timelines.

## Project Structure

```
timecapsule/
├── app/
│   ├── page.tsx              # Landing page (/)
│   ├── layout.tsx            # Root layout
│   ├── explore/
│   │   └── page.tsx          # Public capsules feed (/explore)
│   ├── create/
│   │   └── page.tsx          # Create capsule form (/create)
│   ├── capsule/[id]/
│   │   └── page.tsx          # Individual capsule view (/capsule/[id])
│   └── api/
│       └── capsules/
│           ├── route.ts      # GET/POST capsules
│           └── [id]/
│               └── route.ts  # GET/DELETE/PATCH single capsule
│
├── components/
│   ├── shared/               # Shared UI components
│   │   ├── CapsuleLogo.tsx
│   │   ├── BackgroundEffect.tsx
│   │   ├── CapsuleLockAnimation.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   └── landing/
│       └── LandingPage.tsx
│
├── lib/
│   ├── constants.ts          # STYLES, SEED_CAPSULES
│   ├── utils.ts              # Helper functions
│   ├── types.ts              # TypeScript interfaces
│   ├── capsule-store.ts      # localStorage wrapper (temporary)
│   └── prisma.ts             # Prisma client singleton
│
└── prisma/
    └── schema.prisma         # Database schema
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

The app works immediately with localStorage for data storage.

### 3. (Optional) Set Up Database

To use a real PostgreSQL database:

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update `DATABASE_URL` in `.env` with your database connection string

3. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Routes

| Route           | Description                      |
| --------------- | -------------------------------- |
| `/`             | Landing page with hero animation |
| `/explore`      | Browse public time capsules      |
| `/create`       | Create a new time capsule        |
| `/capsule/[id]` | View a specific capsule          |

## API Endpoints

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| GET    | `/api/capsules`      | List public capsules |
| POST   | `/api/capsules`      | Create a new capsule |
| GET    | `/api/capsules/[id]` | Get a single capsule |
| PATCH  | `/api/capsules/[id]` | Update a capsule     |
| DELETE | `/api/capsules/[id]` | Delete a capsule     |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Database**: PostgreSQL + Prisma (optional)
- **Storage**: localStorage (default)

## Next Steps

1. **Connect Database**: Set up PostgreSQL with Prisma
2. **Add Authentication**: Implement NextAuth for user accounts
3. **Email Reminders**: Add Vercel Cron + Resend for unlock notifications
4. **Social Sharing**: Add OpenGraph image generation for capsule previews

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
