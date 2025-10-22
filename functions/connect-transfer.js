const Stripe = require('stripe');
exports.handler = async (event) => {
  try{
    const { accountId, amount } = JSON.parse(event.body||'{}'); // amount in pence
    const stripe = new Stripe(process.env.STRIPE_SECRET);
    const tr = await stripe.transfers.create({ amount, currency:'gbp', destination: accountId });
    return { statusCode:200, body: JSON.stringify({ ok:true, transfer: tr.id }) };
  }catch(e){ return { statusCode:500, body: JSON.stringify({ error:e.message }) }; }
}
