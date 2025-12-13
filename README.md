# Promptly.ai

A production-ready, open-source AI prompt library built with Next.js, Tailwind CSS, and SQLite.

## Features

- **Prompt Library**: Browse and filter curated prompts for Midjourney, DALL-E, and Stable Diffusion.
- **Community Submissions**: Public gallery of user-submitted prompts (with admin moderation).
- **Zero Paid Dependencies**: Runs 100% locally with SQLite and Ethereal Email (fake SMTP).
- **Modern UI**: Fully responsive Glassmorphism design with Dark Mode by default.
- **Secure**: Input validation, rate limiting (prepared), and secure headers.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
*Note: The defaults in `.env.example` are sufficient for local development. No API keys are needed.*

### 3. Initialize Database
Initialize the SQLite database and seed it with sample data:
```bash
npx prisma migrate dev --name init
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🛠️ Management Guide

### Moderating Submissions
Currently, there is no UI for moderation in this version (coming in v2). 
To approve submissions, you can use Prisma Studio:
```bash
npx prisma studio
```
1. Go to the `Submission` model.
2. Change the `status` column from `pending` to `approved`.
3. Save changes. The item will now appear on the `/community` page.

### Admin Password
The admin password is set in `.env` as `ADMIN_PASSWORD`. This is currently used for future-proofing admin API routes but can be integrated into a custom admin dashboard.

---

## ☁️ Cloud Deployment (Optional)

You can deploy this app to Vercel (recommended) or any Node.js host.

### 1. Database
For production, you cannot use SQLite on Vercel (serverless). You should switch to a provider like Postgres (Neon, Supabase) or MySQL (PlanetScale).
- Update `schema.prisma`: `datasource db { provider = "postgresql" ... }`
- Update `.env`: `DATABASE_URL=postgres://...`

### 2. Object Storage (Images)
By default, images are stored locally in `/public/uploads`. On Vercel, these will vanish on redeploy.
To enable S3 or Cloudinary:
1. Uncomment the S3/Cloudinary vars in `.env`.
2. Update `src/app/api/submit/route.ts` to use the cloud SDK instead of `fs.writeFile`.

### 3. Email (SMTP)
To send real emails instead of using the Ethereal dev console:
1. Get SMTP credentials (e.g., SendGrid, AWS SES, Resend).
2. Fill in `SMTP_HOST`, `SMTP_USER`, etc., in `.env`.
3. The app automatically switches to real email when these are present.

---

## 📄 Customization

### Changing Text
- **"Free until..." banner**: Edit `src/components/Footer.tsx` and `src/app/about/page.tsx`.
- **Hero Title**: Edit `src/app/page.tsx`.

### Adding Categories
To add more AI tools to the filter list:
1. Edit `src/app/library/page.tsx` (frontend filter).
2. Edit `src/app/submit/page.tsx` (dropdown options).

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Prisma + SQLite
- **Forms**: React Hook Form + Zod
- **Email**: Nodemailer
