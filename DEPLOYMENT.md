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
| `NEXT_PUBLIC_SITE_URL` | Your live origin, e.g. `https://launchboarding.com` |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_…`) — needed to take card payments |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the webhook endpoint below (`whsec_…`) |

### 3b. Turning on card payments (Stripe)

The cart and checkout work without Stripe — orders are recorded in the
database and emailed to you so you can invoice by hand. To charge cards:

1. Create a Stripe account and copy the **secret key** into `STRIPE_SECRET_KEY`.
2. In Stripe → **Developers → Webhooks**, add an endpoint pointing at
   `https://launchboarding.com/api/webhooks/stripe`.
3. Subscribe it to exactly these events (and nothing more):

   | Event | Why |
   |---|---|
   | `checkout.session.completed` | Card paid — fulfil the order |
   | `checkout.session.async_payment_succeeded` | Bank-debit style payment finally cleared |
   | `checkout.session.async_payment_failed` | …or it bounced |
   | `checkout.session.expired` | They abandoned checkout |
   | `invoice.paid` | Monthly renewal, or an emailed invoice was paid |
   | `invoice.payment_failed` | Card declined on a renewal — Stripe starts retrying |
   | `customer.subscription.updated` | Plan or status changed |
   | `customer.subscription.deleted` | Monthly service cancelled |
   | `charge.refunded` | Money sent back |
   | `charge.dispute.created` | Chargeback — has a hard response deadline |
   | `radar.early_fraud_warning.created` | Stripe thinks the card is stolen |

4. Copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Redeploy.

### 3c. Key handling

- **Use a restricted key (`rk_live_…`), not a secret key (`sk_live_…`).** A
  restricted key only does what you let it. This integration needs *write* on
  Checkout Sessions, Customers, Invoices and Subscriptions, and *read* on
  Charges, Disputes and Early fraud warnings. Nothing else.
- On Vercel, mark `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as
  [sensitive environment variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables)
  so the values are write-only and never show in logs or the dashboard UI.
- Use a **separate key per environment** (a sandbox key for local work, a live
  key only in production), so one leak doesn't expose everything.
- **Never paste a key into chat, a ticket, a commit or a screenshot.** If one
  ever gets out, roll it at <https://dashboard.stripe.com/apikeys> — rolling is
  instant, free, and makes the leaked string worthless. That is the only fix;
  a key cannot be "un-leaked" any other way.
- Install the key guard so a key can't be committed by accident:

  ```bash
  git config core.hooksPath scripts/git-hooks
  ```

### 3d. Build against a sandbox, not live mode

Do development and testing in a [sandbox](https://docs.stripe.com/sandboxes),
not with a live key — a mistake in live mode moves real money. Test cards are
at <https://docs.stripe.com/testing>; `4242 4242 4242 4242` succeeds and
`4000 0000 0000 9995` is declined.

To exercise webhooks locally:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

`stripe listen` prints its own `whsec_…` — use that as `STRIPE_WEBHOOK_SECRET`
while developing.

### 3e. Sales tax

Launchboarding sells services from Florida. Stripe does **not** collect any tax
until you enable Stripe Tax *and* have an active registration in the customer's
jurisdiction — it fails silently rather than erroring. Once you know where you
have a filing obligation, register in the Dashboard and switch
`automatic_tax: { enabled: true }` on in `src/app/api/checkout/route.ts`. See
[Collect taxes for recurring payments](https://docs.stripe.com/billing/taxes/collect-taxes).
Worth a word with an accountant before turning it on.

Prices live only in `src/lib/catalog.ts` and are always recalculated on the
server, so changing a price there is the single edit needed — and a tampered
cart in someone's browser can't change what they're charged. Orders appear
under **Admin → Orders**, and an order is only ever marked paid by the
signature-verified webhook.

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
