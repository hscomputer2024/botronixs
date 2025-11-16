/* app.js — Unified ElectroMart frontend
   - Products, cart, wishlist, checkout
   - Admin panel (CRUD)
   - Staff panel (orders status)
   - Auth (basic localStorage)
   - Offline-first via localStorage
*/

/* ---------- Helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const uid = (p='id') => p + '_' + Math.random().toString(36).slice(2,9);
const fmt = (n) => '₹' + Number(n).toFixed(2);
const read = (k,d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const write = (k,v) => localStorage.setItem(k, JSON.stringify(v));

/* ---------- Storage keys & seed ---------- */
const LS = {
  PRODUCTS: 'em_products_v1',
  CART: 'em_cart_v1',
  WISH: 'em_wish_v1',
  ORDERS: 'em_orders_v1',
  USERS: 'em_users_v1',
  SESSION: 'em_session_v1'
};


const SEED = [
  {
    id: 'arduino_uno',
    name: 'Arduino Uno R3',
    category: 'Microcontrollers',
    price: 1199,
    stock: 50,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg',
    description: 'Official Arduino Uno R3 board for prototyping.'
  },
  {
    id: 'rpi4',
    sku: 'RPI-4B',
    name: 'Raspberry Pi 4 Model B',
    category: 'Computing Boards',
    price: 5500,
    stock: 30,
    image: './images2.jpeg',
    description: 'Popular single-board computer (Pi 4 Model B).',
    rating: 4.8
  },
  {
    id: 'esp32',
    name: 'ESP32 Module',
    category: 'IoT',
    price: 450,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1603791452906-b4dcebeadccd?w=800&auto=format&fit=crop',
    description: 'WiFi and Bluetooth-enabled microcontroller.'
  },
  {
    id: 'hc_sr04',
    name: 'HC-SR04 Ultrasonic Sensor',
    category: 'Sensors',
    price: 180,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=800&auto=format&fit=crop',
    description: 'Distance measuring ultrasonic sensor.'
  },
  {
    id: 'breadboard',
    name: 'Breadboard 830 Points',
    category: 'Prototyping',
    price: 99,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1581093588401-22b063c2a2f0?w=800&auto=format&fit=crop',
    description: 'Full-size breadboard for circuit prototyping.'
  }

];
if (!read(LS.PRODUCTS)) write(LS.PRODUCTS, SEED);







if(!read(LS.PRODUCTS)) write(LS.PRODUCTS, SEED);
if(!read(LS.USERS)) write(LS.USERS, [{ id:'admin', name:'Admin', email:'admin@electro.local', password:'admin123', role:'admin' }]);
if(!read(LS.ORDERS)) write(LS.ORDERS, []);

/* ---------- App state ---------- */
const App = {
  products: read(LS.PRODUCTS, []),
  cart: read(LS.CART, {}),
  wish: read(LS.WISH, []),
  orders: read(LS.ORDERS, []),
  users: read(LS.USERS, []),
  session: read(LS.SESSION, null),
  currentProduct: null,
  filters: { q:'', category:'', price:'', sort:'relevance', page:1, perPage:9 }
};

/* ---------- Save helpers ---------- */
function saveProducts(){ write(LS.PRODUCTS, App.products); }
function saveCart(){ write(LS.CART, App.cart); updateCartUI(); }
function saveWish(){ write(LS.WISH, App.wish); updateWishUI(); }
function saveOrders(){ write(LS.ORDERS, App.orders); }
function saveUsers(){ write(LS.USERS, App.users); }
function saveSession(){ write(LS.SESSION, App.session); }

/* ---------- UI helpers ---------- */
function updateCartUI(){
  const count = Object.values(App.cart).reduce((s,v)=>s+(v||0),0);
  const el = $('#cart-count'); if(el) el.textContent = count;
}
function updateWishUI(){ const el = $('#wish-count'); if(el) el.textContent = App.wish.length; }
function fmtPrice(n){ return fmt(n); }

/* ---------- Template product card ---------- */
function createProductCard(p){
  const tpl = $('#tpl-product-card');
  if(!tpl) return document.createElement('div');
  const clone = tpl.content.cloneNode(true);
  const art = clone.querySelector('.product-card');
  if(art) art.dataset.id = p.id;
  const img = clone.querySelector('.pimg'); if(img) img.src = p.image;
  const name = clone.querySelector('.pname'); if(name) name.textContent = p.name;
  const cat = clone.querySelector('.pcate'); if(cat) cat.textContent = p.category;
  const price = clone.querySelector('.pprice'); if(price) price.textContent = fmtPrice(p.price);
  const btnAdd = clone.querySelector('.btn-add'); if(btnAdd) { btnAdd.dataset.id = p.id; if(p.stock<=0) btnAdd.disabled = true; }
  const btnWish = clone.querySelector('.btn-wish'); if(btnWish) btnWish.dataset.id = p.id;
  const btnView = clone.querySelector('.btn-view'); if(btnView) btnView.dataset.id = p.id;
  return clone;
}

/* ---------- Render functions ---------- */
function renderGridById(id, items){
  const g = $(`#${id}`); if(!g) return;
  g.innerHTML = '';
  items.forEach(p => g.appendChild(createProductCard(p)));
}
function renderHome(){ renderGridById('deals-grid', App.products.slice(0,3)); renderGridById('featured-grid', App.products.slice(0,6)); renderCategoryNav(); }
function renderProducts(){ // filtered + pagination
  const arr = applyFilters(App.products);
  const start = (App.filters.page-1) * App.filters.perPage;
  const pageItems = arr.slice(start, start + App.filters.perPage);
  renderGridById('products-grid', pageItems);
  renderPagination(Math.ceil(arr.length / App.filters.perPage), App.filters.page);
  populateFilterCategories();
}
function renderProductDetail(){ const p = App.products.find(x=>x.id === App.currentProduct); if(!p) return showView('products'); $('#pd-gallery').innerHTML = `<img src="${p.image}" alt="${p.name}">`; $('#pd-info').innerHTML = `<h2>${p.name}</h2><div class="meta">${p.category} • ${p.sku||''}</div><div class="price">${fmtPrice(p.price)}</div><p>${p.description||''}</p><div style="margin-top:12px"><button id="pd-add" class="btn btn-primary" ${p.stock<=0?'disabled':''}>Add to cart</button><button id="pd-wish" class="btn btn-ghost">Wishlist</button></div>`; setTimeout(()=>{ const a = $('#pd-add'); if(a) a.onclick = ()=> addToCart(p.id); const w = $('#pd-wish'); if(w) w.onclick = ()=> toggleWish(p.id); },0); const related = App.products.filter(x=>x.category===p.category && x.id!==p.id).slice(0,4); renderGridById('pd-related', related); }
function renderCart(){
  const el = $('#cart-list'); if(!el) return; el.innerHTML = '';
  const ids = Object.keys(App.cart);
  if(ids.length===0){ el.innerHTML = '<p>Your cart is empty</p>'; $('#cart-subtotal').textContent = fmtPrice(0); return; }
  let subtotal = 0;
  ids.forEach(id => {
    const p = App.products.find(x=>String(x.id)===String(id)); if(!p) return;
    const q = App.cart[id] || 0;
    const line = p.price * q; subtotal += line;
    const row = document.createElement('div'); row.className='card cart-row';
    row.innerHTML = `<img src="${p.image}" alt="${p.name}"><div style="flex:1"><strong>${p.name}</strong><div class="meta">${p.sku||''}</div></div><div style="text-align:right">${fmtPrice(line)}<div style="margin-top:8px"><button class="btn" data-op="decr" data-id="${id}">-</button><span style="margin:0 8px">${q}</span><button class="btn" data-op="incr" data-id="${id}">+</button></div></div><button class="btn" data-op="rem" data-id="${id}">Remove</button>`;
    row.querySelectorAll('button[data-op]').forEach(b=> b.addEventListener('click', ()=>{
      const op = b.dataset.op, pid = b.dataset.id;
      if(op==='decr') changeQty(pid, Math.max(1, (App.cart[pid]||1)-1));
      if(op==='incr') changeQty(pid, (App.cart[pid]||0)+1);
      if(op==='rem'){ delete App.cart[pid]; saveCart(); renderCart(); updateCartUI(); }
    }));
    el.appendChild(row);
  });
  $('#cart-subtotal').textContent = fmtPrice(subtotal);
}
function renderWishlist(){ const g = $('#wishlist-grid'); if(!g) return; g.innerHTML=''; const items = App.products.filter(p=>App.wish.includes(String(p.id))); if(!items.length){ g.innerHTML='<p>No items in wishlist</p>'; return; } items.forEach(p=> g.appendChild(createProductCard(p))); }
function renderOrders(){ const el = $('#orders-list'); if(!el) return; if(!App.orders.length){ el.innerHTML = '<p>No orders yet</p>'; return; } el.innerHTML = App.orders.map(o=>`<div class="card"><strong>Order ${o.id}</strong> — ${o.status} — ${new Date(o.created_at).toLocaleString()}<div>${o.items.map(i=>`<div>${i.qty} × ${i.name}</div>`).join('')}</div><div>Total: ${fmtPrice(o.total)}</div></div>`).join(''); }

/* ---------- Filters & pagination ---------- */
function applyFilters(arr){
  let r = arr.slice();
  const f = App.filters;
  if(f.q) r = r.filter(p => (p.name + ' ' + (p.description||'')).toLowerCase().includes(f.q.toLowerCase()));
  if(f.category) r = r.filter(p=>p.category===f.category);
  if(f.price){
    if(f.price.includes('-')){ const [lo,hi] = f.price.split('-').map(Number); r = r.filter(p=>p.price>=lo && p.price<=hi); }
    else if(f.price.endsWith('+')){ const lo = Number(f.price.replace('+','')); r = r.filter(p=>p.price>=lo); }
  }
  if(f.sort==='price-asc') r.sort((a,b)=>a.price-b.price);
  if(f.sort==='price-desc') r.sort((a,b)=>b.price-a.price);
  if(f.sort==='rating-desc') r.sort((a,b)=>(b.rating||0)-(a.rating||0));
  return r;
}
function renderPagination(totalPages, current){
  const wrap = $('#pagination'); if(!wrap) return; wrap.innerHTML=''; for(let i=1;i<=Math.max(1,totalPages);i++){ const b = document.createElement('button'); b.className = i===current ? 'btn btn-primary' : 'btn'; b.textContent = i; b.addEventListener('click', ()=>{ App.filters.page = i; renderProducts(); }); wrap.appendChild(b); }
}
function populateFilterCategories(){ const cats = Array.from(new Set(App.products.map(p=>p.category||'General'))); $('#filter-category').innerHTML = `<option value="">All</option>` + cats.map(c=>`<option value="${c}">${c}</option>`).join(''); $('#filter-category').value = App.filters.category || ''; }

/* ---------- Category nav ---------- */
function renderCategoryNav(){ const cats = Array.from(new Set(App.products.map(p=>p.category||'General'))); const nav = $('#category-nav'); if(!nav) return; nav.innerHTML=''; cats.forEach(c=>{ const b = document.createElement('button'); b.className='nav-cat'; b.textContent=c; b.onclick = ()=>{ App.filters.category = c; App.filters.page = 1; renderProducts(); showView('products'); }; nav.appendChild(b); }); }

/* ---------- Cart operations ---------- */
function addToCart(id, qty=1){
  const pid = String(id);
  App.cart[pid] = (App.cart[pid]||0) + qty;
  saveCart();
  updateCartUI();
  smallToast('Added to cart');
}
function changeQty(pid, qty){ App.cart[pid] = qty; if(qty<=0) delete App.cart[pid]; saveCart(); renderCart(); updateCartUI(); }
function saveCart(){ write(LS.CART, App.cart); }
function toggleWish(id){ const pid = String(id); if(App.wish.includes(pid)) App.wish = App.wish.filter(x=>x!==pid); else App.wish.push(pid); saveWish(); smallToast('Wishlist updated'); }
function saveWish(){ write(LS.WISH, App.wish); updateWishUI(); }

/* ---------- Product open ---------- */
function openProduct(id){ App.currentProduct = id; renderProductDetail(); showView('product-detail'); }

/* ---------- Modal helpers ---------- */
function openModal(html){ $('#modal-body').innerHTML = html; $('#modal').classList.remove('hidden'); }
function closeModal(){ $('#modal').classList.add('hidden'); $('#modal-body').innerHTML = ''; }

/* ---------- Checkout ---------- */
$('#btn-checkout')?.addEventListener('click', ()=> {
  const items = Object.keys(App.cart).map(id => { const p = App.products.find(x=>String(x.id)===String(id)); return { product_id:id, name:p.name, qty:App.cart[id], unit_price:p.price }; });
  if(items.length===0){ alert('Cart empty'); return; }
  const total = items.reduce((s,i)=>s + i.qty * i.unit_price, 0);
  // show checkout modal / form
  openModal(`<h3>Checkout</h3>
    <form id="checkout-form" class="card" style="display:flex;flex-direction:column;gap:8px">
      <input id="cx-name" placeholder="Full name" required>
      <input id="cx-email" placeholder="Email" type="email" required>
      <textarea id="cx-addr" placeholder="Shipping address" required></textarea>
      <div>Total: <strong>${fmtPrice(total)}</strong></div>
      <div style="display:flex;gap:8px"><button class="btn btn-primary" type="submit">Place Order</button><button type="button" class="btn btn-ghost" id="cx-cancel">Cancel</button></div>
    </form>`);
  $('#cx-cancel').onclick = closeModal;
  $('#checkout-form').onsubmit = (e)=> {
    e.preventDefault();
    const order = { id: uid('ord'), created_at: new Date().toISOString(), status:'created', items, total, customer:{ name: $('#cx-name').value, email: $('#cx-email').value, address: $('#cx-addr').value } };
    App.orders.unshift(order); saveOrders();
    App.cart = {}; saveCart(); renderCart(); updateCartUI();
    closeModal();
    alert('Order placed — ' + order.id);
    renderOrders();
  };
});

/* ---------- Admin: Add / Edit / Delete ---------- */
$('#admin-add-form')?.addEventListener('submit', (e)=> {
  e.preventDefault();
  const fd = new FormData(e.target);
  const id = fd.get('id') || uid('p');
  let specs = fd.get('specs') || '';
  try{ specs = JSON.parse(specs || '{}'); }catch{ specs = {}; }
  const prod = { id, sku: fd.get('sku') || '', name: fd.get('name'), category: fd.get('category')||'General', price: Number(fd.get('price')||0), stock: Number(fd.get('stock')||0), image: fd.get('image') || 'https://picsum.photos/seed/' + Math.random() + '/800/600', datasheet: '', description: fd.get('desc')||'', specs, rating:4.0, created_at: Date.now() };
  const idx = App.products.findIndex(p=>p.id===id);
  if(idx>=0) App.products[idx] = prod; else App.products.unshift(prod);
  saveProducts(); renderAdmin(); renderProducts(); e.target.reset(); smallToast('Saved product');
});
function renderAdmin(){
  $('#admin-products-list').innerHTML = App.products.map(p=>`<div style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #f2f8ff"><div><strong>${p.name}</strong><div class="meta">${p.category} • ${p.sku}</div></div><div><button class="btn admin-edit" data-id="${p.id}">Edit</button> <button class="btn admin-del" data-id="${p.id}">Delete</button></div></div>`).join('');
  $$('#admin-products-list .admin-del').forEach(b=>b.addEventListener('click', ()=> { if(confirm('Delete product?')){ App.products = App.products.filter(x=>x.id!==b.dataset.id); saveProducts(); renderAdmin(); renderProducts(); } }));
  $$('#admin-products-list .admin-edit').forEach(b=>b.addEventListener('click', ()=> { const p = App.products.find(x=>x.id===b.dataset.id); const form = $('#admin-add-form'); form.elements['id'].value = p.id; form.elements['sku'].value = p.sku; form.elements['name'].value = p.name; form.elements['category'].value = p.category; form.elements['price'].value = p.price; form.elements['stock'].value = p.stock; form.elements['image'].value = p.image; form.elements['desc'].value = p.description; form.elements['specs'].value = JSON.stringify(p.specs || {}, null,2); }));
}
$('#export-json')?.addEventListener('click', ()=> { const blob = new Blob([JSON.stringify({ products: App.products, orders: App.orders, users: App.users }, null, 2)], { type:'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'electromart-data.json'; document.body.appendChild(a); a.click(); a.remove(); });
$('#import-json')?.addEventListener('change', async e=> { const f = e.target.files[0]; if(!f) return; const txt = await f.text(); try{ const data = JSON.parse(txt); if(Array.isArray(data.products)){ App.products = data.products; saveProducts(); renderProducts(); renderAdmin(); } if(Array.isArray(data.orders)){ App.orders = data.orders; saveOrders(); } }catch(err){ alert('Invalid JSON'); } });

/* ---------- Staff ---------- */
function renderStaff(){
  $('#staff-orders').innerHTML = App.orders.length ? App.orders.map(o=>{ const ops=['picked','packed','shipped','delivered','cancelled']; return `<div class="card"><div><strong>${o.id}</strong> — ${o.status} — ${new Date(o.created_at).toLocaleString()}</div><div>${o.items.map(it=>`<div>${it.qty} × ${it.name}</div>`).join('')}</div><div style="margin-top:8px">${ops.map(s=>`<button class="btn staff-op" data-id="${o.id}" data-op="${s}">${s}</button>`).join(' ')}</div></div>` }).join('') : '<p>No orders</p>'; $$('#staff-orders .staff-op').forEach(b=>b.addEventListener('click', ()=>{ const id=b.dataset.id, op=b.dataset.op; const ord = App.orders.find(x=>x.id===id); if(ord){ ord.status = op; saveOrders(); renderStaff(); renderOrders(); smallToast('Status updated'); } })); }

/* ---------- Auth (simple) ---------- */
function openAuthModal(){
  openModal(`<h3>Login / Signup</h3><form id="mini-auth" class="card" style="display:flex;flex-direction:column;gap:8px"><input id="m-email" placeholder="Email" type="email" required><input id="m-pass" placeholder="Password" type="password" required><div style="display:flex;gap:8px"><button id="m-login" class="btn btn-primary" type="submit">Login</button><button id="m-signup" type="button" class="btn btn-ghost">Sign up</button></div></form>`);
  $('#mini-auth').onsubmit = (e)=>{ e.preventDefault(); const email=$('#m-email').value, pass=$('#m-pass').value; const u = App.users.find(x=>x.email===email && x.password===pass); if(u){ App.session={id:u.id,name:u.name,email:u.email,role:u.role}; saveSession(); closeModal(); smallToast('Welcome '+u.name); } else alert('Invalid credentials'); };
  $('#m-signup').onclick = ()=>{ const email=$('#m-email').value, pass=$('#m-pass').value; if(!email||!pass){ alert('Enter email & password'); return; } if(App.users.some(x=>x.email===email)){ alert('Account exists'); return; } const nu={id:uid('u'),name:email.split('@')[0],email,password:pass,role:'user'}; App.users.push(nu); saveUsers(); App.session={id:nu.id,name:nu.name,email:nu.email,role:nu.role}; saveSession(); closeModal(); smallToast('Account created'); };
}
$('#logout-btn')?.addEventListener('click', ()=>{ localStorage.removeItem(LS.SESSION); App.session=null; smallToast('Logged out'); showView('home'); });

/* ---------- Event delegation for product buttons ---------- */
$('#app').addEventListener('click', (e)=> {
  const add = e.target.closest('.btn-add'); if(add){ addToCart(add.dataset.id); return; }
  const wish = e.target.closest('.btn-wish'); if(wish){ toggleWish(wish.dataset.id); return; }
  const view = e.target.closest('.btn-view'); if(view){ openProduct(view.dataset.id); return; }
});

/* ---------- Small UI helpers ---------- */
function smallToast(msg){ const old = document.title; document.title = msg; setTimeout(()=>document.title = old, 900); }
function showView(name){ $$('.view').forEach(v=>v.classList.add('hidden')); $(`#view-${name}`).classList.remove('hidden'); if(name==='home') renderHome(); if(name==='products') renderProducts(); if(name==='product-detail') renderProductDetail(); if(name==='cart') renderCart(); if(name==='wishlist') renderWishlist(); if(name==='admin') renderAdmin(); if(name==='staff') renderStaff(); if(name==='orders') renderOrders(); }

/* ---------- Wire top controls ---------- */
$('#nav-home')?.addEventListener('click', ()=> showView('home'));
$('#home-shop')?.addEventListener('click', ()=> showView('products'));
$('#home-products')?.addEventListener('click', ()=> showView('products'));
$('#nav-cart')?.addEventListener('click', ()=> { renderCart(); showView('cart'); });
$('#nav-wishlist')?.addEventListener('click', ()=> { renderWishlist(); showView('wishlist'); });
$('#nav-orders')?.addEventListener('click', ()=> showView('orders'));
$('#nav-profile')?.addEventListener('click', ()=> openAuthModal());
$('#open-admin')?.addEventListener('click', ()=> showView('admin'));
$('#open-staff')?.addEventListener('click', ()=> showView('staff'));
$('#pd-back')?.addEventListener('click', ()=> showView('products'));
$('#modal-close')?.addEventListener('click', closeModal);
$('#apply-filters')?.addEventListener('click', ()=>{ App.filters.category = $('#filter-category').value; App.filters.price = $('#filter-price').value; App.filters.sort = $('#sort-by').value; App.filters.page = 1; renderProducts(); });
$('#reset-filters')?.addEventListener('click', ()=>{ App.filters={q:'',category:'',price:'',sort:'relevance',page:1,perPage:9}; renderProducts(); });

/* ---------- Export/Import wiring done earlier (admin) ---------- */

/* ---------- Theme toggle ---------- */
$('#btn-theme')?.addEventListener('click', ()=> {
  const root = document.documentElement;
  const cur = root.getAttribute('data-theme');
  if(cur==='dark'){ root.removeAttribute('data-theme'); $('#btn-theme i').className='fa-solid fa-moon'; }
  else{ root.setAttribute('data-theme','dark'); $('#btn-theme i').className='fa-solid fa-sun'; }
});

/* ---------- Init ---------- */
function boot(){
  updateCartUI(); updateWishUI(); renderHome(); renderProducts(); renderAdmin(); renderOrders(); renderStaff();
  // wire search quick
  $('#nav-search')?.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ App.filters.q = e.target.value; App.filters.page = 1; renderProducts(); showView('products'); }});
  // wire clear cart
  $('#btn-clear-cart')?.addEventListener('click', ()=>{ if(confirm('Clear cart?')){ App.cart={}; saveCart(); renderCart(); updateCartUI(); }});
}
boot();

/* ---------- expose for debugging ---------- */
window.App = App;
window.addToCart = addToCart;
window.openProduct = openProduct;
