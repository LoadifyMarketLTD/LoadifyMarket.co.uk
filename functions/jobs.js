let mem = [];
const { createClient } = require('@supabase/supabase-js');
exports.handler = async (event) => {
  const method = event.httpMethod;
  const supa = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE) ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE) : null;
  if(method==='POST'){
    const b = JSON.parse(event.body||'{}');
    const job = { id: Date.now(), pickup:b.pickup, dropoff:b.dropoff, price:b.price, vehicle:b.vehicle, created_at: new Date().toISOString(), status:'open' };
    if(supa) await supa.from('jobs').insert([job]); else mem.unshift(job);
    return { statusCode:200, body: JSON.stringify({ message:'Job posted', job }) };
  } else {
    if(supa){ const { data } = await supa.from('jobs').select('*').order('created_at',{ascending:false}).limit(50); return { statusCode:200, body: JSON.stringify({ jobs: data||[] }) }; }
    return { statusCode:200, body: JSON.stringify({ jobs: mem }) };
  }
}
