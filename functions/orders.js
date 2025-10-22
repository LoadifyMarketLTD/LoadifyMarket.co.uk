import { db, json } from "./_helpers.mjs";
export default async () => {
  const supa = db(); if(!supa) return json(200,{items:[]});
  const { data, error } = await supa.from("orders").select("*").order("created_at",{ascending:false}).limit(20);
  if(error) return json(500,{error:error.message}); return json(200,{items:data});
};