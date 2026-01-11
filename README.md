# ToolBox Pro - Passive Income Web Business

A SaaS micro-tools platform for PDF and image processing. This is a proven passive income model that can generate €500-1000/month with minimal maintenance.

## Business Model

- **Free Tier**: 5 conversions per day (builds user base, SEO traffic)
- **Pro Subscription**: €9.99/month or €79.99/year
- **Target**: 50-100 paying subscribers = €500-1000/month

## Features

### PDF Tools
- Merge PDF - Combine multiple PDFs
- Split PDF - Extract specific pages
- Compress PDF - Reduce file size
- PDF to Image - Convert pages to images

### Image Tools
- Compress Image - Reduce file size
- Resize Image - Change dimensions
- Convert Image - PNG, JPG, WebP, GIF
- Image to PDF - Create PDF from images

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe Subscriptions
- **Processing**: pdf-lib (PDFs), sharp (images)
- **Deployment**: Vercel (recommended)

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo>
cd toolbox-pro
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in:

```env
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Stripe (dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
```

### 3. Set Up Stripe Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create a Product: "ToolBox Pro"
3. Add two prices:
   - Monthly: €9.99/month recurring
   - Yearly: €79.99/year recurring
4. Copy the price IDs to your `.env`

### 4. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/toolbox-pro)

### Manual Deploy

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Set Up Stripe Webhook

After deploying, create a webhook in Stripe:

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to Vercel env vars

## Marketing Strategy for €500-1000/month

### SEO (Primary Traffic Source)
1. Target keywords like "merge pdf online free", "compress image online"
2. Add blog posts about PDF/image optimization
3. Build backlinks from tool directories

### Social Media
1. Share tips on Twitter/LinkedIn
2. Post on Reddit (r/webdev, r/productivity)
3. Create YouTube tutorials

### Paid Ads (Optional)
- Google Ads for high-intent keywords
- Start with €50-100/month budget
- Target 5-10x ROI

## Maintenance

This business requires minimal maintenance:

- **Weekly**: Check error logs, respond to support emails
- **Monthly**: Review analytics, update dependencies
- **Quarterly**: Add new features based on user feedback

## Scaling Beyond €1000/month

1. Add more tools (QR code generator, text tools, etc.)
2. Implement team plans
3. Add API access for developers
4. White-label solutions for agencies

## License

MIT License - feel free to modify and use commercially.

---

Built with Next.js and Stripe. Questions? Open an issue!
