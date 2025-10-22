let mem = [];
const { createClient } = require('@supabase/supabase-js');
exports.handler = async (event) => {
  const method = event.httpMethod;
  const supa = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE) ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE) : null;
  if(method==='POST'){
    const b = JSON.parse(event.body||'{}');
    const rev = { id: Date.now(), target:b.target, stars:b.stars, comment:b.comment, created_at:new Date().toISOString() };
    if(supa) await supa.from('reviews').insert([rev]); else mem.unshift(rev);
    return { statusCode:200, body: JSON.stringify({ message:'Review added', review: rev }) };
  } else {
    if(supa){ const { data } = await supa.from('reviews').select('*').order('created_at',{ascending:false}).limit(100); return { statusCode:200, body: JSON.stringify({ reviews: data||[] }) }; }
    return { statusCode:200, body: JSON.stringify({ reviews: mem }) };
  }
}
