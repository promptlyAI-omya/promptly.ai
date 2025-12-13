# Deployment Guide

This guide describes how to take Promptly.ai from local development to a production environment.

## 1. Vercel Deployment (Recommended)

Vercel is the creators of Next.js and offers the easiest deployment.

1. **Push code to GitHub/GitLab**.
2. **Import project in Vercel**.
3. **Environment Variables**:
   - You MUST override `DATABASE_URL` to point to a permanent database (see below).
   - Set `NEXT_PUBLIC_API_BASE` to your production URL (or keep relative `/api`).
   - Set `ADMIN_PASSWORD`.

> **CRITICAL**: SQLite (`file:./dev.db`) **WILL NOT WORK** on Vercel because the filesystem is read-only/ephemeral. 

### Database Solution for Serverless
You need a cloud database. We recommend:
- **Neon** (Serverless Postgres)
- **Supabase** (Postgres)
- **Turso** (SQLite over HTTP)

**Steps to switch to Postgres:**
1. Open `prisma/schema.prisma`.
2. Change `provider = "sqlite"` to `provider = "postgresql"`.
3. Run `npm install` to update entry.
4. Set `DATABASE_URL="postgres://user:pass@host:5432/db"` in Vercel Env Vars.
5. Add a "Build Command" in Vercel: `npx prisma generate && next build`.
   - *Note: You usually run migrations locally or in a CI step, not during build.*

## 2. Docker / VPS Deployment

If you want to keep using SQLite or own the infrastructure:

1. **Build the container**:
   ```bash
   docker build -t promptly .
   ```
   *(Dockerfile not included, but standard Next.js Dockerfile works)*

2. **Run with volume**:
   ```bash
   docker run -p 3000:3000 -v $(pwd)/prisma:/app/prisma promptly
   ```
   Mapping the volume ensures `dev.db` persists.

## 3. Storage Strategy

### Uploads
The current code stores uploads in `/public/uploads`.
- **VPS/Docker**: Persistent if you map the volume.
- **Vercel/Netlify**: **BROKEN**. Files will disappear.

**Fix**: Enable Cloudinary or S3.
1. Create a Cloudinary account (Free tier is generous).
2. Add `CLOUDINARY_URL` to env.
3. Update `src/app/api/submit/route.ts` to push to Cloudinary.

## 4. Maintenance

### Backups
- If using SQLite: Cron job to copy `prisma/dev.db` to S3.
- If using Postgres: Use provider's backup solution.

### Updates
1. `git pull`
2. `npm install`
3. `npx prisma migrate deploy`
4. `npm run build`
5. Restart process (PM2 or Docker).
