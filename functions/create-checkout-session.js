const Stripe = require('stripe');
exports.handler = async (event) => {
  try{
    const { items } = JSON.parse(event.body||'{}');
    const STRIPE_SECRET = process.env.STRIPE_SECRET;
    const PRICE_ID = process.env.STRIPE_PRICE_ID;
    const SITE_URL = process.env.SITE_URL || (event.headers.origin||'');
    if(!STRIPE_SECRET){ return { statusCode:200, body: JSON.stringify({ url: '/orders.html?demo=1' }) }; }
    const stripe = new Stripe(STRIPE_SECRET);
    const line_items = (items||[]).map(i => PRICE_ID
      ? { price: PRICE_ID, quantity: i.qty||1 }
      : { price_data: { currency:'gbp', product_data:{ name: i.name }, unit_amount: Math.round((i.price||0)*100) }, quantity: i.qty||1 }
    );
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${SITE_URL}/orders.html?ok=1`,
      cancel_url: `${SITE_URL}/cart.html?cancel=1`
    });
    return { statusCode:200, body: JSON.stringify({ url: session.url }) };
  }catch(e){ return { statusCode:500, body: JSON.stringify({ error:e.message }) }; }
}
