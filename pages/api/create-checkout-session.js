// pages/api/create-checkout-session.js
// Redirects users to Whop checkout for BeatScript Producer Pro
// Whop shows both monthly ($9) and annual ($79) plan options on their hosted checkout page

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Whop checkout URL for BeatScript Producer Pro product
  // Both monthly and annual plans are presented on Whop's checkout page
  const WHOP_PRODUCT_ID = 'prod_zkdSsdhQlDvQe';
  const checkoutUrl = `https://whop.com/checkout/${WHOP_PRODUCT_ID}/`;

  res.json({ url: checkoutUrl });
}
