export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

  const secretKey = process.env.STRIPE_SECRET_KEY;

  try {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session_id)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      }
    );

    const session = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: session.error?.message || 'Stripe error' });
    }

    if (session.payment_status !== 'paid') {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      email: session.customer_details?.email,
      customerId: session.customer,
      subscriptionId: session.subscription,
      plan: session.metadata?.plan || 'pro',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
