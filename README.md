# ToolBox Pro - Static HTML Passive Income Tool

A **single HTML file** that works directly in any browser. No server required. Just open `index.html` and start using it.

## How It Works

Everything runs **100% in the browser**:
- PDF processing uses [pdf-lib](https://pdf-lib.js.org/) (loaded from CDN)
- Image processing uses native Canvas API
- Files are NEVER uploaded anywhere
- Usage tracking via localStorage

## Features

### PDF Tools
- **Merge PDF** - Combine multiple PDFs
- **Split PDF** - Extract specific pages
- **Compress PDF** - Reduce file size

### Image Tools
- **Compress Image** - Reduce size with quality slider
- **Resize Image** - Change dimensions
- **Convert Image** - PNG, JPG, WebP
- **Image to PDF** - Create PDF from images

## Business Model

| Tier | Price | Features |
|------|-------|----------|
| Free | €0 | 5 uses per day (tracked in browser) |
| Pro | €9.99/mo | Unlimited (requires Stripe integration) |

**Target**: 50-100 paying customers = €500-1000/month

## Deployment Options

### Option 1: GitHub Pages (Free)
1. Push to GitHub
2. Go to Settings → Pages
3. Select "Deploy from branch" → main
4. Your site is live at `https://username.github.io/repo-name`

### Option 2: Netlify (Free)
1. Drag and drop the folder to [netlify.com/drop](https://netlify.com/drop)
2. Get instant URL

### Option 3: Any Web Host
Just upload `index.html` to any web server (Apache, Nginx, etc.)

### Option 4: Local
Just open `index.html` in your browser

## Setting Up Stripe Payments

1. Create account at [stripe.com](https://stripe.com)
2. Create a Product: "ToolBox Pro"
3. Add a price: €9.99/month recurring
4. Create a Payment Link
5. Replace the placeholder URL in `index.html`:

```html
<a href="https://buy.stripe.com/YOUR_LINK_HERE" class="btn btn-primary">
```

## Monetization Strategy

1. **SEO Traffic**: Target keywords like "merge pdf online free"
2. **Limit free usage**: 5/day drives upgrades
3. **Stripe Payment Links**: Simple, no-code payment collection
4. **Email capture**: Add newsletter signup for remarketing

## Customization

Edit the HTML file to:
- Change colors (CSS variables at top)
- Add/remove tools
- Modify pricing
- Add your branding
- Add Google Analytics

## File Structure

```
/
├── index.html    # Everything in one file
└── README.md     # This file
```

That's it! One file = entire business.

## License

MIT - Use commercially, modify freely.
