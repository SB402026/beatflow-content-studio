// pages/api/verify-session.js
// After Whop checkout, verifies the user's new membership is active.
// Called from the /success page with the user's email.
// (Replaces the old Stripe session verification — Whop doesn't use session IDs)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Whop not configured' });

  const WHOP_PRODUCT_ID = 'prod_zkdSsdhQlDvQe';

  try {
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
      console.error('Whop verify error:', JSON.stringify(data));
      return res.status(500).json({ error: data.message || 'Whop API error' });
    }

    const memberships = data.data || [];
    const membership = memberships.find(
      (m) => m.status === 'active' && m.product_id === WHOP_PRODUCT_ID
    );

    if (membership) {
      res.json({
        success: true,
        plan: membership.plan_id,
        validUntil: membership.renewal_period_end,
      });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error('verify-session error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
