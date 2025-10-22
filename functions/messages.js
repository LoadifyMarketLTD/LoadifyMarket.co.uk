import { db, json } from "./_helpers.mjs"; let MEMORY=[];
export default async (req)=>{
  const supa=db();
  if(req.method==="POST"){ const p=await req.json(); if(supa){ const {data,error}=await supa.from("messages").insert({to: p.to, text: p.text}).select().single(); if(error) return json(500,{error:error.message}); return json(200,data); } MEMORY.push(Object.assign({},p,{id:String(Date.now())})); return json(200,{ok:true}); }
  if(supa){ const {data,error}=await supa.from("messages").select("*").order("created_at",{ascending:false}); if(error) return json(500,{error:error.message}); return json(200,{items:data}); }
  return json(200,{items:MEMORY});
};