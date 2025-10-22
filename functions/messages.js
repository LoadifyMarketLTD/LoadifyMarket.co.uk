let mem = [];
const { createClient } = require('@supabase/supabase-js');
exports.handler = async (event) => {
  const method = event.httpMethod;
  const supa = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE) ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE) : null;
  if(method==='POST'){
    const b = JSON.parse(event.body||'{}');
    const msg = { id: Date.now(), to:b.to, subject:b.subject, body:b.body, created_at:new Date().toISOString() };
    if(supa) await supa.from('messages').insert([msg]); else mem.unshift(msg);
    return { statusCode:200, body: JSON.stringify({ ok:true, message:'sent', msg }) };
  } else {
    if(supa){ const { data } = await supa.from('messages').select('*').order('created_at',{ascending:false}).limit(100); return { statusCode:200, body: JSON.stringify({ messages: data||[] }) }; }
    return { statusCode:200, body: JSON.stringify({ messages: mem }) };
  }
}
