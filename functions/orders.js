const { createClient } = require('@supabase/supabase-js');
exports.handler = async () => {
  try{
    const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE);
    const { data, error } = await supa.from('orders').select('*').order('created_at',{ascending:false}).limit(50);
    if(error) throw error;
    return { statusCode:200, body: JSON.stringify({ orders: data||[] }) };
  }catch(e){ return { statusCode:200, body: JSON.stringify({ orders: [] }) }; }
}
