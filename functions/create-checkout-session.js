import Stripe from "stripe";
export default async (req) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET);
  const body = await req.json().catch(()=>({}));
  const items = (body.items||[]).map(i => ({
    price_data:{ currency:"gbp", product_data:{ name:i.name||"Item" }, unit_amount:i.price||100 },
    quantity: i.qty||1
  }));
  const session = await stripe.checkout.sessions.create({
    mode:"payment", line_items: items.length?items:[{price_data:{currency:"gbp",product_data:{name:"Demo item"},unit_amount:500},quantity:1}],
    success_url: `${process.env.SITE_URL}/orders.html?ok=1`, cancel_url: `${process.env.SITE_URL}/cart.html?canceled=1`
  });
  return new Response(JSON.stringify({ url: session.url }), { status:200, headers:{ "content-type":"application/json" } });
};