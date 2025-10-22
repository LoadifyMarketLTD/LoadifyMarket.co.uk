const Stripe = require('stripe');
exports.handler = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET);
  const account = await stripe.accounts.create({ type: 'express' });
  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: (process.env.SITE_URL||'') + '/dashboard.html?connect=refresh',
    return_url: (process.env.SITE_URL||'') + '/dashboard.html?connect=return',
    type: 'account_onboarding',
  });
  return { statusCode:200, body: JSON.stringify({ url: link.url, account: account.id }) };
}
