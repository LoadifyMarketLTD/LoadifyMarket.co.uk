import Stripe from "stripe";
export default async ()=>{ const stripe=new Stripe(process.env.STRIPE_SECRET);
  const account=await stripe.accounts.create({type:"express"});
  const link=await stripe.accountLinks.create({account:account.id,refresh_url:process.env.SITE_URL+"/connect-refresh",return_url:process.env.SITE_URL+"/connect-done",type:"account_onboarding"});
  return new Response(JSON.stringify({url:link.url,account:account.id}),{status:200,headers:{"content-type":"application/json"}});
};