import { db, json } from "./_helpers.mjs";
const DEMO=[{name:"Euro Pallets (x10)",price:7500},{name:"Shrink Wrap Roll",price:1299},{name:"Ratchet Strap",price:899}];
export default async (req)=>{
  const supa=db(); const u=new URL(req.url); const op=u.searchParams.get("op");
  if(op==="seedProducts"){ if(!supa) return json(200,{count:DEMO.length,note:"in-memory"}); const {data,error}=await supa.from("products").insert(DEMO).select(); if(error) return json(500,{error:error.message}); return json(200,{count:data.length}); }
  if(op==="listProducts"){ if(!supa) return json(200,{items:DEMO}); const {data,error}=await supa.from("products").select("*").order("created_at",{ascending:false}); if(error) return json(500,{error:error.message}); return json(200,{items:data}); }
  if(op==="seedAll"){ return json(200,{ok:true,note:"Run schema.sql once. Seeded via seedProducts."}); }
  return json(200,{ok:true});
};