// pages/api/check-subscription.js
// Verifies whether a user has an active BeatScript Producer Pro membership via Whop API

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Whop not configured' });

  const WHOP_PRODUCT_ID = 'prod_zkdSsdhQlDvQe';

  try {
    // Query Whop API for active memberships matching this email and product
    const url = new URL('https://api.whop.com/v5/memberships');
    url.searchParams.set('email', email);
    url.searchParams.set('product_id', WHOP_PRODUCT_ID);
    url.searchParams.set('status', 'active');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Whop API error:', JSON.stringify(data));
      return res.status(500).json({ error: data.message || 'Whop API error' });
    }

    // data.data is the array of memberships
    const memberships = data.data || [];
    const isPro = memberships.some(
      (m) => m.status === 'active' && m.product_id === WHOP_PRODUCT_ID
    );

    res.json({ isPro });
  } catch (err) {
    console.error('check-subscription error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
