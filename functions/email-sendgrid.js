import sg from "@sendgrid/mail";
export default async (req)=>{ sg.setApiKey(process.env.SENDGRID_API_KEY||""); const b=await req.json();
  if(!process.env.SENDGRID_API_KEY) return new Response(JSON.stringify({ok:false,error:"SENDGRID_API_KEY missing"}),{status:400,headers:{"content-type":"application/json"}});
  const msg={to:b.to,from:"no-reply@loadifymarket.co.uk",subject:b.subject||"Notification",html:b.html||"<p>Hello</p>"};
  const r=await sg.send(msg); return new Response(JSON.stringify({ok:true,status:r[0].statusCode}),{status:200,headers:{"content-type":"application/json"}});
};