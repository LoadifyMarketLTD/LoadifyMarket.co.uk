
// Load cart helpers
const CART_KEY='lm_cart';
function getCart(){return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}
function setCart(x){localStorage.setItem(CART_KEY,JSON.stringify(x));updateCartCount();renderCart&&renderCart()}
function updateCartCount(){const el=document.getElementById('cartCount'); if(el) el.textContent=getCart().length}
updateCartCount();

// Render products
function renderProducts(){
  const tbody=document.getElementById('prodRows'); if(!tbody) return;
  const data = window.__PRODUCTS__ || [];
  tbody.innerHTML=data.map(p=>`<tr><td>${p.name}</td><td>£${p.price.toFixed(2)}</td><td><button class='btn' onclick="addToCart('${p.name}',${p.price})">Add</button></td></tr>`).join('');
}
renderProducts();
function addToCart(name,price){const c=getCart();c.push({name,price,qty:1});setCart(c)}
function renderCart(){
  const root=document.getElementById('cartRoot'); if(!root) return;
  const items=getCart();
  if(!items.length){root.innerHTML='<div class="small">Cart empty.</div>';return}
  const total=items.reduce((s,i)=>s+i.price*i.qty,0);
  root.innerHTML=items.map(i=>`<div style="display:flex;justify-content:space-between"><div>${i.name}</div><div>£${i.price.toFixed(2)}</div></div>`).join('')+`<div style="margin-top:10px;font-weight:700">Total £${total.toFixed(2)}</div>`;
}
renderCart();

// Checkout
async function checkout(){
  const items=getCart(); if(!items.length){alert('Cart empty');return}
  const res=await fetch('/.netlify/functions/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})});
  const data=await res.json();
  if(data.url){window.location=data.url}else{alert('Checkout error: '+(data.error||'unknown'))}
}

// Jobs
async function postJob(){
  const p=document.getElementById('pickup').value;
  const d=document.getElementById('dropoff').value;
  const price=parseFloat(document.getElementById('price').value||'0');
  const vehicle=document.getElementById('vehicle').value;
  const res=await fetch('/.netlify/functions/jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pickup:p,dropoff:d,price,vehicle})});
  const j=await res.json(); alert(j.message||'Posted'); loadJobs();
}
async function loadJobs(){
  const res=await fetch('/.netlify/functions/jobs'); const j=await res.json();
  const root=document.getElementById('jobList'); if(!root) return;
  root.innerHTML=(j.jobs||[]).map(x=>`<div class="card"><div><b>${x.pickup}</b> → <b>${x.dropoff}</b></div><div class="small">£${x.price} · ${x.vehicle}</div>
  <div style="margin-top:8px"><input placeholder="Your bid £" id="bid-${x.id}" style="width:120px"> <button class="btn" onclick="placeBid(${x.id})">Bid</button></div>
  </div>`).join('');
}
loadJobs();
async function placeBid(jobId){
  const inp=document.getElementById('bid-'+jobId); const val=parseFloat(inp.value||'0');
  const r=await fetch('/.netlify/functions/bids',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jobId,amount:val})});
  const j=await r.json(); alert(j.message||'Bid sent');
}

// Messages
async function sendMsg(){
  const to=document.getElementById('msgTo').value;
  const subject=document.getElementById('msgSub').value;
  const body=document.getElementById('msgBody').value;
  const r=await fetch('/.netlify/functions/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({to,subject,body})});
  const j=await r.json(); alert(j.ok?'Sent':'Error'); listMsgs();
}
async function listMsgs(){
  const r=await fetch('/.netlify/functions/messages'); const j=await r.json();
  const root=document.getElementById('msgList'); if(!root) return;
  root.innerHTML=(j.messages||[]).map(m=>`<div class='card'><div><b>${m.to}</b> · ${m.subject||''}</div><div class='small'>${m.body||''}</div></div>`).join('');
}
listMsgs();

// Reviews
async function postReview(){
  const target=document.getElementById('revTarget').value;
  const stars=parseInt(document.getElementById('revStars').value||'5');
  const comment=document.getElementById('revComment').value;
  const r=await fetch('/.netlify/functions/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({target,stars,comment})});
  const j=await r.json(); alert(j.message||'OK'); listReviews();
}
async function listReviews(){
  const r=await fetch('/.netlify/functions/reviews'); const j=await r.json();
  const root=document.getElementById('revList'); if(!root) return;
  root.innerHTML=(j.reviews||[]).map(x=>`<div class='card'><div><b>${x.target}</b> · ⭐ ${x.stars}</div><div class='small'>${x.comment||''}</div></div>`).join('');
}
listReviews();

// Admin seed demo
async function seedProducts(){await fetch('/.netlify/functions/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'seed'})}); alert('Seeded');}
