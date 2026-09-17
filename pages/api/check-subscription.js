import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ isPro: false });

  try {
    const customers = await stripe.customers.list({ email, limit: 5 });
    if (!customers.data.length) return res.json({ isPro: false, plan: null });

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 5,
      });

      if (subscriptions.data.length) {
        const sub = subscriptions.data[0];
        const priceId = sub.items.data[0]?.price?.id;
        const plan =
          priceId === process.env.STRIPE_ANNUAL_PRICE_ID ? 'annual' : 'monthly';
        return res.json({ isPro: true, plan, customerId: customer.id });
      }
    }

    res.json({ isPro: false, plan: null });
  } catch (err) {
    console.error('check-subscription error:', err.message);
    res.status(500).json({ isPro: false, error: err.message });
  }
}
