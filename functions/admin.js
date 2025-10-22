const { createClient } = require('@supabase/supabase-js');
exports.handler = async (event) => {
  try{
    const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE);
    const products=[
      { id:'p1', name:'EUR Pallet (lot 30)', price:15000 },
      { id:'p2', name:'UK→RO Transport (1 pallet)', price:22000 }
    ];
    await supa.from('products').upsert(products);
    return { statusCode:200, body: JSON.stringify({ ok:true }) };
  }catch(e){ return { statusCode:500, body: JSON.stringify({ error:e.message }) }; }
}
