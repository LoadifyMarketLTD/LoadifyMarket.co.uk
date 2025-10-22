let mem = [];
const { createClient } = require('@supabase/supabase-js');
exports.handler = async (event) => {
  const method = event.httpMethod;
  const supa = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE) ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE) : null;
  if(method==='POST'){
    const b = JSON.parse(event.body||'{}');
    const bid = { id: Date.now(), job_id:b.jobId, amount:b.amount, created_at:new Date().toISOString() };
    if(supa) await supa.from('bids').insert([bid]); else mem.unshift(bid);
    return { statusCode:200, body: JSON.stringify({ message:'Bid submitted', bid }) };
  } else {
    if(supa){ const { data } = await supa.from('bids').select('*').order('created_at',{ascending:false}).limit(100); return { statusCode:200, body: JSON.stringify({ bids: data||[] }) }; }
    return { statusCode:200, body: JSON.stringify({ bids: mem }) };
  }
}
