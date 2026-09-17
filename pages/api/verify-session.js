import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ success: false, error: 'Missing session_id' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'customer'],
    });

    const paid =
      session.payment_status === 'paid' || session.status === 'complete';

    if (!paid) {
      return res.json({ success: false });
    }

    const email = session.customer_details?.email || session.customer?.email || '';
    const customerId =
      typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    // Determine plan from price ID
    const priceId =
      session.subscription?.items?.data?.[0]?.price?.id ||
      session.line_items?.data?.[0]?.price?.id;

    const plan =
      priceId === process.env.STRIPE_ANNUAL_PRICE_ID ? 'annual' : 'monthly';

    res.json({ success: true, email, customerId, subscriptionId, plan });
  } catch (err) {
    console.error('verify-session error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}
