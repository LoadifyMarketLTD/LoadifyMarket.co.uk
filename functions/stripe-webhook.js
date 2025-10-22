const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
exports.handler = async (event) => {
  const STRIPE_SECRET = process.env.STRIPE_SECRET;
  const stripe = new Stripe(STRIPE_SECRET);
  const sig = event.headers['stripe-signature'];
  const whsec = process.env.STRIPE_WEBHOOK_SECRET || '';
  try{
    const evt = stripe.webhooks.constructEvent(event.body, sig, whsec);
    if(evt.type==='checkout.session.completed'){
      const session = evt.data.object;
      const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE);
      await supa.from('orders').insert([{
        id: session.id,
        email: session.customer_details && session.customer_details.email,
        total: session.amount_total || 0,
        currency: session.currency || 'gbp',
        status: 'paid',
        created_at: new Date().toISOString()
      }]);
    }
    return { statusCode:200, body: JSON.stringify({ received:true }) };
  }catch(e){ return { statusCode:400, body:`Webhook Error: ${e.message}` }; }
}
