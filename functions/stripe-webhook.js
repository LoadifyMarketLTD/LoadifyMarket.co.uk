import Stripe from "stripe"; import { db, json } from "./_helpers.mjs";
export default async (req) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET);
  const sig = req.headers.get("stripe-signature"); const raw = await req.arrayBuffer();
  let event; try{ event = stripe.webhooks.constructEvent(Buffer.from(raw), sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch(err){ return new Response(`Webhook Error: ${err.message}`, { status:400 }); }
  if(event.type === "checkout.session.completed"){
    const s = event.data.object; const amount = s.amount_total || 0; const email = s.customer_details?.email || null;
    const supa = db(); if(supa){ await supa.from("orders").insert({ amount, status:"paid", stripe_payment_intent: s.payment_intent, email }); }
  }
  return json(200,{received:true});
};