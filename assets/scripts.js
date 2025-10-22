async function getJSON(url, opts={}){ const r=await fetch(url,opts); if(!r.ok) throw new Error(await r.text()); return r.json(); }
function qs(s){return document.querySelector(s)}
document.addEventListener('DOMContentLoaded', () => {
  const url = location.pathname;
  if (url.endsWith('/products.html')) initProducts();
  if (url.endsWith('/cart.html')) initCart();
  if (url.endsWith('/orders.html')) initOrders();
  if (url.endsWith('/jobs.html')) initJobs();
  if (url.endsWith('/messages.html')) initMessages();
  if (url.endsWith('/reviews.html')) initReviews();
  if (url.endsWith('/admin.html')) initAdmin();
});
let CART = JSON.parse(localStorage.getItem('CART')||'[]');
function saveCart(){ localStorage.setItem('CART', JSON.stringify(CART)); }
async function initProducts(){
  const wrap = qs('#products'); const seed = qs('#seedProducts');
  seed?.addEventListener('click', async () => {
    const r = await getJSON('/.netlify/functions/admin?op=seedProducts'); alert('Seeded '+r.count+' products'); location.reload();
  });
  const r = await getJSON('/.netlify/functions/admin?op=listProducts');
  wrap.innerHTML = r.items.map(p => `<div class="card"><b>${p.name}</b> — £${(p.price/100).toFixed(2)} <button data-id="${p.id}" class="add">Add</button></div>`).join('');
  wrap.addEventListener('click', e => {
    const b = e.target.closest('button.add'); if(!b) return;
    const id = b.getAttribute('data-id');
    const prod = r.items.find(x=>x.id===id);
    CART.push({id, name: prod.name, price: prod.price, qty:1}); saveCart(); alert('Added to cart');
  });
}
function initCart(){
  const wrap = qs('#cart'); function render(){ wrap.innerHTML = CART.map((i,idx)=>`<div class="card">#${idx+1} ${i.name} — £${(i.price/100).toFixed(2)}</div>`).join('')||'<p>Empty</p>'; } render();
  qs('#checkout')?.addEventListener('click', async () => {
    const r = await getJSON('/.netlify/functions/create-checkout-session', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({items:CART})}); location.href = r.url;
  });
}
async function initOrders(){ const r = await getJSON('/.netlify/functions/orders'); qs('#orders').innerHTML = r.items.map(o=>`<div class="card"><b>Order ${o.id}</b> — £${(o.amount/100).toFixed(2)} — ${o.status}</div>`).join('')||'<p>No orders</p>'; }
function initJobs(){
  const form = qs('#jobForm'); const list = qs('#jobsList');
  form.addEventListener('submit', async (e)=>{ e.preventDefault(); const data = Object.fromEntries(new FormData(form).entries()); data.budget = Number(data.budget);
    await getJSON('/.netlify/functions/jobs', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(data)}); form.reset(); load(); });
  async function load(){ const r = await getJSON('/.netlify/functions/jobs'); list.innerHTML = r.items.map(j=>`<div class="card"><b>${j.title}</b> — £${j.budget}<br>${j.pickup} → ${j.dropoff}</div>`).join('')||'<p>No jobs</p>'; } load();
}
function initMessages(){
  const form = qs('#msgForm'); const list = qs('#messagesList');
  form.addEventListener('submit', async (e)=>{ e.preventDefault(); const data = Object.fromEntries(new FormData(form).entries());
    await getJSON('/.netlify/functions/messages', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(data)}); form.reset(); load(); });
  async function load(){ const r = await getJSON('/.netlify/functions/messages'); list.innerHTML = r.items.map(m=>`<div class="card"><b>To:</b> ${m.to} — ${m.text}</div>`).join('')||'<p>No messages</p>'; } load();
}
function initReviews(){
  const form = qs('#revForm'); const list = qs('#reviewsList');
  form.addEventListener('submit', async (e)=>{ e.preventDefault(); const data = Object.fromEntries(new FormData(form).entries()); data.rating = Number(data.rating);
    await getJSON('/.netlify/functions/reviews', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(data)}); form.reset(); load(); });
  async function load(){ const r = await getJSON('/.netlify/functions/reviews'); list.innerHTML = r.items.map(m=>`<div class="card"><b>${m.for}</b> ★${m.rating}<br>${m.text}</div>`).join('')||'<p>No reviews</p>'; } load();
}
function initAdmin(){ qs('#seedAll')?.addEventListener('click', async ()=>{ const r = await getJSON('/.netlify/functions/admin?op=seedAll'); qs('#adminOut').textContent = JSON.stringify(r,null,2); }); }