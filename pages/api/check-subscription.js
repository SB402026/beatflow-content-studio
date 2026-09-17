export default async function handler(req, res) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const secretKey = process.env.STRIPE_SECRET_KEY;

  try {
    // Search customers by email
    const searchRes = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=5`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const searchData = await searchRes.json();

    if (!searchRes.ok || !searchData.data?.length) {
      return res.json({ isPro: false });
    }

    // Check subscriptions for each customer
    for (const customer of searchData.data) {
      const subsRes = await fetch(
        `https://api.stripe.com/v1/subscriptions?customer=${customer.id}&status=active&limit=5`,
        { headers: { Authorization: `Bearer ${secretKey}` } }
      );
      const subsData = await subsRes.json();

      if (subsData.data?.length > 0) {
        const sub = subsData.data[0];
        const priceId = sub.items?.data?.[0]?.price?.id;
        const annualId = process.env.STRIPE_ANNUAL_PRICE_ID;
        const plan = priceId === annualId ? 'annual' : 'monthly';
        return res.json({ isPro: true, plan, customerId: customer.id });
      }
    }

    res.json({ isPro: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
