# Launchboard — Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone & Install

```bash
git clone <repo-url>
cd jubilant-computing-machine
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/launchboard_db"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

Default admin credentials:
- Email: `admin@launchboard.co`
- Password: `Admin@123!`

### 4. Run Development Server

```bash
npm run dev
```

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git add -A
git commit -m "Initial deploy"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import your GitHub repository
4. Framework: **Next.js** (auto-detected)

### 3. Environment Variables in Vercel

In the Vercel project settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_SECRET` | 32-byte random string |
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g., `https://yourapp.vercel.app`) |

### 4. Database (Recommended: Neon or Supabase)

**Neon (Free tier available):**
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Paste as `DATABASE_URL` in Vercel

**Supabase:**
1. Create account at [supabase.com](https://supabase.com)
2. New project → Settings → Database → Connection string (URI mode)
3. Replace `[YOUR-PASSWORD]` with your DB password

### 5. Run Migrations on Production

After deploying, run migrations via Vercel CLI or your database dashboard:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
npm run prisma:seed
```

Or connect directly with your DATABASE_URL:
```bash
DATABASE_URL="..." npx prisma migrate deploy
DATABASE_URL="..." npm run prisma:seed
```

### 6. File Uploads on Vercel

Vercel has an ephemeral filesystem — uploaded files won't persist between deployments. For production file storage:

**Option A: Vercel Blob (recommended)**
```bash
npm install @vercel/blob
```
Add `BLOB_READ_WRITE_TOKEN` to Vercel env vars.

**Option B: AWS S3**
```bash
npm install @aws-sdk/client-s3
```
Add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_REGION`.

**Option C: Cloudinary**
```bash
npm install cloudinary
```
Add `CLOUDINARY_URL`.

For the current implementation, files are stored locally — this works in development and on servers with persistent storage (VPS, Railway, Render).

---

## VPS / Railway / Render Deployment

### Railway

1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add PostgreSQL service (free tier available)
4. Set environment variables in the Railway dashboard
5. Railway auto-runs `npm run build` and `npm start`

### Render

1. Create account at [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npm start`
5. Add PostgreSQL database via Render dashboard
6. Set env vars

---

## Post-Deployment Checklist

- [ ] Admin account seeded and working
- [ ] Login at `/login` with admin credentials
- [ ] Test form submission at `/get-started`
- [ ] Verify project appears in admin dashboard at `/admin/dashboard`
- [ ] Test file uploads
- [ ] Update `NEXTAUTH_URL` to match your production domain
- [ ] Change admin password after first login
- [ ] Set up custom domain (optional)

---

## Customization

### Change Company Name
Replace all instances of `Launchboard` / `Launchboard` / `launchboard` with your company name.

Key files:
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/AdminSidebar.tsx`
- `src/app/layout.tsx` (metadata)
- `src/app/(public)/page.tsx`

### Change Colors
Edit `tailwind.config.ts` → `theme.extend.colors.brand` and update `blue-600` references throughout the codebase.

### Add/Remove Pages
Add new pages to `src/app/(public)/` following the existing pattern.
