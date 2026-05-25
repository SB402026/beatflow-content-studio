# 🎛️ BeatFlow Content Studio

> Marketing tools for music producers. Beat titles, YouTube SEO, social captions, bios, and pricing copy — in seconds.

---

## 🚀 Deploy to Vercel (5 minutes, free)

### 1. Push to GitHub
```bash
# Create a new repo on github.com, then:
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/beatflow-content-studio.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Click **Deploy** — that's it. Vercel auto-detects Next.js.

Your app will be live at `https://beatflow-content-studio.vercel.app` (or your custom domain).

### 3. Custom Domain (optional, ~$10/yr)
- Buy a domain on Namecheap or Cloudflare
- In Vercel → Project Settings → Domains → Add your domain
- Follow the DNS instructions (takes ~5 minutes)

---

## 💰 Connecting Payments (Stripe or Whop)

### Option A: Whop (easiest, 2 minutes)
1. Create a product on [whop.com](https://whop.com) — set price at $9/month
2. Replace the `alert(...)` in `UpgradeModal` with your Whop product link:
```js
window.open("https://whop.com/YOUR-PRODUCT-LINK", "_blank");
```
3. When a user pays on Whop, you can give them a code or token to paste in your app to unlock Pro.

### Option B: Stripe (full control)
1. Create a Stripe account and a subscription product at $9/month
2. Install Stripe: `npm install stripe @stripe/stripe-js`
3. Add a `/pages/api/checkout.js` route:
```js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: 'YOUR_PRICE_ID', quantity: 1 }],
    success_url: `${req.headers.origin}/?pro=true`,
    cancel_url: `${req.headers.origin}/`,
  });
  res.json({ url: session.url });
}
```
4. On success redirect, read `?pro=true` from URL and set localStorage:
```js
localStorage.setItem('bf_pro', 'true');
```

---

## 🔐 Pro Access Verification

Currently, Pro status is toggled client-side for demo purposes.
For production, replace the `isPro` state with one of these:

**Simple (Whop/code-based):**
```js
const [isPro, setIsPro] = useState(
  () => typeof window !== 'undefined' && localStorage.getItem('bf_pro') === 'true'
);
```

**Robust (JWT/session-based):** Use NextAuth.js + a database to store subscriptions.

---

## 📁 Project Structure

```
beatflow/
├── pages/
│   ├── _app.js          # App wrapper
│   └── index.js         # Main UI
├── lib/
│   ├── generators.js    # All 5 content generators
│   └── usage.js         # Free tier rate limiting
├── styles/
│   └── globals.css      # Global styles
├── vercel.json          # Vercel config
└── package.json
```

---

## 🛠 Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📈 Pricing Strategy

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 1 generation per tool per day |
| Pro Monthly | $9/mo | Unlimited everything |
| Pro Annual | $79/yr | Unlimited + 26% savings |

---

## 🗺 Roadmap Ideas

- [ ] Email template generator
- [ ] Collab pitch scripts
- [ ] Contract / licensing email templates  
- [ ] Beat store description writer
- [ ] TikTok hook generator
- [ ] SoundCloud tag optimizer

---

Built for producers who move different. 🎛️
