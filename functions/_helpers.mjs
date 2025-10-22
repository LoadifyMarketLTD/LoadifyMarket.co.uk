import { createClient } from "@supabase/supabase-js";
const { SUPABASE_URL, SUPABASE_SERVICE } = process.env;
export function db(){
  if(!SUPABASE_URL || !SUPABASE_SERVICE) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE, { auth:{ persistSession:false } });
}
export function json(status, data){ return new Response(JSON.stringify(data), { status, headers:{ "content-type":"application/json" } }); }
