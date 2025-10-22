import Stripe from "stripe";
export default async (req)=>{ const stripe=new Stripe(process.env.STRIPE_SECRET); const b=await req.json();
  const tr=await stripe.transfers.create({amount:b.amount,currency:"gbp",destination:b.accountId});
  return new Response(JSON.stringify({id:tr.id}),{status:200,headers:{"content-type":"application/json"}});
};