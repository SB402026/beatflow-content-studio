export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const checkoutUrl = `https://whop.com/beatscript-eaf8/beatscript-producer-pro/`;
  res.json({ url: checkoutUrl });
}
