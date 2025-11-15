<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>  Admin — Full CRUD (Single File)</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
  :root{--md-surface:#ffffff;--md-primary:#1976d2;--md-on-primary:#fff;--md-on-surface:#1f2937;--md-muted:#6b7280;--sidebar-width:280px}
  *{box-sizing:border-box}body{margin:0;font-family:Roboto,Arial,Helvetica,sans-serif;background:linear-gradient(180deg,#f7fbff,#eef4fb);color:var(--md-on-surface)}
  .topbar{position:fixed;top:0;left:0;right:0;height:64px;display:flex;align-items:center;gap:12px;padding:0 20px;background:var(--md-surface);box-shadow:0 1px 3px rgba(16,24,40,.06);z-index:600}
  .logo-mark{width:40px;height:40px;border-radius:8px;background:var(--md-primary);display:flex;align-items:center;justify-content:center;color:var(--md-on-primary);font-weight:700}
  .search{flex:1;max-width:720px}
  .search input{width:100%;padding:10px 14px;border-radius:999px;border:1px solid rgba(16,24,40,.06);background:#f5f7fb}
  .icon-btn{width:44px;height:44px;border-radius:8px;display:grid;place-items:center;cursor:pointer;background:transparent;border:0}
  .layout{display:flex;margin-top:64px;min-height:calc(100vh - 64px)}
  .sidebar{width:var(--sidebar-width);background:var(--md-surface);border-right:1px solid rgba(16,24,40,.04);padding:18px;position:relative}
  .avatar{width:44px;height:44px;border-radius:8px;background:linear-gradient(135deg,#cfe8ff,#a9d2ff);display:flex;align-items:center;justify-content:center;color:var(--md-primary);font-weight:700}
  .nav{margin-top:14px}
  .item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:8px;cursor:pointer}
  .item:hover{background:rgba(25,118,210,.06)}
  .submenu{margin-left:36px;margin-top:6px;display:none;flex-direction:column;gap:6px}
  .sub-item{padding:8px 10px;border-radius:8px;cursor:pointer;color:var(--md-muted)}
  .content-wrap{flex:1;padding:26px}
  .page{background:var(--md-surface);border-radius:12px;padding:20px;box-shadow:0 6px 12px rgba(16,24,40,.08);min-height:360px}
  .row{display:flex;gap:12px;align-items:center}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;background:var(--md-primary);color:var(--md-on-primary);border:0;cursor:pointer}
  .field{display:flex;flex-direction:column;gap:6px;margin-bottom:8px}
  input,select,textarea{padding:10px;border-radius:8px;border:1px solid rgba(16,24,40,.06)}
  table{width:100%;border-collapse:collapse}
  th,td{padding:8px;border-bottom:1px solid #eee;text-align:left}
  @media (max-width:980px){.sidebar{position:fixed;left:0;top:64px;bottom:0;transform:translateX(-100%);transition:transform .28s}.sidebar.show{transform:translateX(0)}.content-wrap{padding:16px}}
  .muted{color:var(--md-muted)}
</style>
</head>
<body>
<header class="topbar">
  <div style="display:flex;align-items:center;gap:12px">
    <div class="logo-mark">AD</div>
    <div style="display:flex;flex-direction:column;line-height:1"><strong>Admin_Dashboard</strong><small class="muted">Full CRUD Demo</small></div>
  </div>
  <div class="search"><input id="global-search" placeholder="Search products, employees, orders..."></div>
  <div style="display:flex;gap:8px;align-items:center"><button class="icon-btn" id="btn-toggle-sidebar">☰</button></div>
</header>
<div class="layout">
  <aside class="sidebar" id="sidebar">
    <div style="display:flex;gap:12px;align-items:center;padding-bottom:8px;border-bottom:1px solid rgba(16,24,40,.03)">
      <div class="avatar">SA</div>
      <div><div style="font-weight:600">Super Admin</div><div class="muted" style="font-size:12px">Administrator</div></div>
    </div>
    <nav class="nav">
      <div class="item" data-key="products">📦 <div style="font-weight:500;margin-left:6px">Products</div><div style="margin-left:auto">▸</div></div>
      <div class="submenu" data-parent="products">
        <div class="sub-item" data-page="add-product">Add Product</div>
        <div class="sub-item" data-page="manage-products">Manage Products</div>
        <div class="sub-item" data-page="categories">Categories</div>
      </div>

      <div class="item" data-key="orders">🧾 <div style="font-weight:500;margin-left:6px">Orders</div><div style="margin-left:auto">▸</div></div>
      <div class="submenu" data-parent="orders">
        <div class="sub-item" data-page="new-orders">New Orders</div>
        <div class="sub-item" data-page="completed-orders">Completed Orders</div>
        <div class="sub-item" data-page="cancelled-orders">Cancelled Orders</div>
      </div>

      <div class="item" data-key="employees">👥 <div style="font-weight:500;margin-left:6px">Employees</div><div style="margin-left:auto">▸</div></div>
      <div class="submenu" data-parent="employees">
        <div class="sub-item" data-page="add-employee">Add Employee</div>
        <div class="sub-item" data-page="manage-employees">Manage Employees</div>
        <div class="sub-item" data-page="payments">Payments</div>
      </div>

      <div class="item" data-key="billing">💳 <div style="font-weight:500;margin-left:6px">Billing</div><div style="margin-left:auto">▸</div></div>
      <div class="submenu" data-parent="billing">
        <div class="sub-item" data-page="bill-generate">Bill Generate</div>
        <div class="sub-item" data-page="today-sales">Today Sales</div>
        <div class="sub-item" data-page="today-revenue">Today Revenue</div>
        <div class="sub-item" data-page="today-customers">Today Customers</div>
      </div>

      <div class="item" data-key="reports">📊 <div style="font-weight:500;margin-left:6px">Reports</div><div style="margin-left:auto">▸</div></div>
      <div class="submenu" data-parent="reports">
        <div class="sub-item" data-page="monthly-report">Monthly Report</div>
        <div class="sub-item" data-page="yearly-summary">Yearly Summary</div>
        <div class="sub-item" data-page="recent-orders">Recent Orders</div>
      </div>

      <div class="item" data-key="settings">⚙️ <div style="font-weight:500;margin-left:6px">Settings</div><div style="margin-left:auto">▸</div></div>
      <div class="submenu" data-parent="settings">
        <div class="sub-item" data-page="general">General</div>
        <div class="sub-item" data-page="payment">Payment</div>
        <div class="sub-item" data-page="email">Email</div>
      </div>
    </nav>
  </aside>

  <main class="content-wrap">
    <div id="content-area" class="page">
      <h1>Welcome</h1>
      <p class="muted">Use the left menu to manage Products, Orders, Employees, Billing and Settings. This demo stores data in localStorage.</p>
    </div>
  </main>
</div>

<script>
// Simple client-side DB using localStorage
const DB = {
  products: JSON.parse(localStorage.getItem('products')||'[]'),
  categories: JSON.parse(localStorage.getItem('categories')||'[]'),
  employees: JSON.parse(localStorage.getItem('employees')||'[]'),
  orders: JSON.parse(localStorage.getItem('orders')||'[]'),
  bills: JSON.parse(localStorage.getItem('bills')||'[]'),
  save(){
    localStorage.setItem('products', JSON.stringify(this.products));
    localStorage.setItem('categories', JSON.stringify(this.categories));
    localStorage.setItem('employees', JSON.stringify(this.employees));
    localStorage.setItem('orders', JSON.stringify(this.orders));
    localStorage.setItem('bills', JSON.stringify(this.bills));
  }
};

// Page templates
const pages = {
  'add-product': addProductTpl,
  'manage-products': manageProductsTpl,
  'categories': categoriesTpl,
  'add-employee': addEmployeeTpl,
  'manage-employees': manageEmployeesTpl,
  'payments': paymentsTpl,
  'bill-generate': billGenerateTpl,
  'new-orders': newOrdersTpl,
  'completed-orders': completedOrdersTpl,
  'cancelled-orders': cancelledOrdersTpl,
  'today-sales': todaySalesTpl,
  'today-revenue': todayRevenueTpl,
  'today-customers': todayCustomersTpl,
  'monthly-report': monthlyReportTpl,
  'yearly-summary': yearlySummaryTpl,
  'recent-orders': recentOrdersTpl,
  'general': generalTpl,
  'payment': paymentTpl,
  'email': emailTpl
};

// Template functions (return HTML strings)
function addProductTpl(){
  const cats = DB.categories.slice();
  return `
    <h1>Add Product</h1>
    <div class="field"><label class="small">Product Name</label><input id="p_name" type="text"></div>
    <div class="field"><label class="small">Price</label><input id="p_price" type="number"></div>
    <div class="field"><label class="small">Category</label>
      <select id="p_category">${cats.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}${cats.length===0?'<option value="">(no categories)</option>':''}</select>
    </div>
    <div class="field"><label class="small">Description</label><textarea id="p_desc" rows="3"></textarea></div>
    <div class="row">
      <button class="btn" onclick="saveProduct()">Save Product</button>
      <button class="btn" style="background:#6b7280" onclick="openPage('manage-products')">Cancel</button>
    </div>
  `;
}

function manageProductsTpl(){
  return `
    <h1>Manage Products</h1>
    <div style=\"margin-bottom:12px\">
      <button class=\"btn\" onclick=\"openPage('add-product')\">＋ New Product</button>
      <button class=\"btn\" style=\"background:#0ea5a6;margin-left:8px\" onclick=\"exportProducts()\">Export JSON</button>
    </div>
    <table id=\"products_table\">
      <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Actions</th></tr></thead>
      <tbody></tbody>
    </table>
  `;
}

function categoriesTpl(){
  return `
    <h1>Categories</h1>
    <div class=\"field\"><input id=\"cat_name\" placeholder=\"New category name\"></div>
    <div class=\"row\"><button class=\"btn\" onclick=\"saveCategory()\">Save Category</button></div>
    <div style=\"margin-top:12px\">
      <h3>Existing</h3><ul id=\"cat_list\"></ul>
    </div>
  `;
}

function addEmployeeTpl(){
  return `
    <h1>Add Employee</h1>
    <div class=\"field\"><label class=\"small\">Name</label><input id=\"e_name\" type=\"text\"></div>
    <div class=\"field\"><label class=\"small\">Role</label><input id=\"e_role\" type=\"text\"></div>
    <div class=\"row\"><button class=\"btn\" onclick=\"saveEmployee()\">Save Employee</button></div>
  `;
}

function manageEmployeesTpl(){
  return `
    <h1>Manage Employees</h1>
    <table id=\"employees_table\">
      <thead><tr><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
      <tbody></tbody>
    </table>
  `;
}

function paymentsTpl(){return `<h1>Payments</h1><p>Payments list will appear here (demo).</p>`}
function billGenerateTpl(){
  return `
    <h1>Generate Bill</h1>
    <div class=\"field\"><label class=\"small\">Customer</label><input id=\"b_customer\" type=\"text\"></div>
    <div class=\"field\"><label class=\"small\">Items (comma separated: name:price)</label><input id=\"b_items\" placeholder=\"apple:30,banana:20\"></div>
    <div class=\"row\"><button class=\"btn\" onclick=\"generateBill()\">Save Bill</button></div>
  `;
}

function newOrdersTpl(){return `<h1>New Orders</h1><p>No demo orders.</p>`}
function completedOrdersTpl(){return `<h1>Completed Orders</h1><p>None.</p>`}
function cancelledOrdersTpl(){return `<h1>Cancelled Orders</h1><p>None.</p>`}
function todaySalesTpl(){return `<h1>Today Sales</h1><p>₹0</p>`}
function todayRevenueTpl(){return `<h1>Today Revenue</h1><p>₹0</p>`}
function todayCustomersTpl(){return `<h1>Today Customers</h1><p>0</p>`}
function monthlyReportTpl(){return `<h1>Monthly Report</h1><p>Demo charts coming.</p>`}
function yearlySummaryTpl(){return `<h1>Yearly Summary</h1><p>Demo stats.</p>`}
function recentOrdersTpl(){return `<h1>Recent Orders</h1><p>Demo.</p>`}
function generalTpl(){return `<h1>General Settings</h1><p>Demo settings.</p>`}
function paymentTpl(){return `<h1>Payment Settings</h1><p>Demo payment config.</p>`}
function emailTpl(){return `<h1>Email Settings</h1><p>Demo email config.</p>`}

// Utility escape
function escapeHtml(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

// Open page loader (no extra wrapper to avoid blocking inputs)
function openPage(page){
  const area = document.getElementById('content-area');
  if(typeof pages[page] === 'function') area.innerHTML = pages[page]();
  else if(typeof pages[page] === 'string') area.innerHTML = pages[page];
  else area.innerHTML = '<h1>404</h1>';
  // attach dynamic loaders
  setTimeout(()=>{
    if(page === 'manage-products') renderProducts();
    if(page === 'categories') renderCategories();
    if(page === 'manage-employees') renderEmployees();
  },10);
}

// Sidebar behaviour
const sidebar = document.getElementById('sidebar');
document.getElementById('btn-toggle-sidebar').addEventListener('click', ()=> sidebar.classList.toggle('show'));
document.querySelectorAll('.item').forEach(it=>{
  it.addEventListener('click', function(){
    const key = this.getAttribute('data-key');
    const submenu = document.querySelector(`.submenu[data-parent="${key}"]`);
    document.querySelectorAll('.submenu').forEach(s=>{ if(s!==submenu) s.style.display='none'; });
    if(submenu){ submenu.style.display = submenu.style.display==='flex'?'none':'flex'; }
  });
});
document.querySelectorAll('.sub-item').forEach(si=> si.addEventListener('click', function(e){ e.stopPropagation(); openPage(this.getAttribute('data-page')); if(window.innerWidth<980) sidebar.classList.remove('show'); }));

/* =====================
   PRODUCTS CRUD
   ===================== */
function saveProduct(){
  const name = document.getElementById('p_name').value.trim();
  const price = parseFloat(document.getElementById('p_price').value||0);
  const category = document.getElementById('p_category').value;
  const desc = document.getElementById('p_desc').value.trim();
  if(!name) return alert('Enter product name');
  const id = Date.now();
  DB.products.push({id,name,price,category,desc}); DB.save();
  alert('Product added'); openPage('manage-products');
}

function renderProducts(){
  const tbody = document.querySelector('#products_table tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  DB.products.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.id}</td><td>${escapeHtml(p.name)}</td><td>₹${Number(p.price).toFixed(2)}</td><td>${escapeHtml(p.category||'')}</td><td><button class=\"btn\" onclick=\"editProduct(${p.id})\">Edit</button> <button class=\"btn\" style=\"background:#ef4444\" onclick=\"deleteProduct(${p.id})\">Delete</button></td>`;
    tbody.appendChild(tr);
  });
}

function editProduct(id){
  const p = DB.products.find(x=>x.id===id); if(!p) return alert('Not found');
  const name = prompt('Product name', p.name); if(name===null) return; p.name = name;
  const price = prompt('Price', p.price); if(price===null) return; p.price = parseFloat(price)||0;
  const category = prompt('Category', p.category||''); if(category===null) return; p.category = category;
  DB.save(); renderProducts();
}

function deleteProduct(id){ if(!confirm('Delete product?')) return; DB.products = DB.products.filter(p=>p.id!==id); DB.save(); renderProducts(); }

function exportProducts(){ const data = JSON.stringify(DB.products,null,2); const w=window.open(); w.document.body.innerHTML = '<pre>'+escapeHtml(data)+'</pre>'; }

/* =====================
   CATEGORIES CRUD
   ===================== */
function saveCategory(){ const name = document.getElementById('cat_name').value.trim(); if(!name) return alert('Enter name'); DB.categories.push(name); DB.save(); alert('Category saved'); renderCategories(); }
function renderCategories(){ const ul = document.getElementById('cat_list'); if(!ul) return; ul.innerHTML = ''; DB.categories.forEach((c,i)=>{ const li = document.createElement('li'); li.textContent = c; ul.appendChild(li); }); }

/* =====================
   EMPLOYEES CRUD
   ===================== */
function saveEmployee(){ const name = document.getElementById('e_name').value.trim(); const role = document.getElementById('e_role').value.trim(); if(!name||!role) return alert('Fill fields'); const id=Date.now(); DB.employees.push({id,name,role}); DB.save(); alert('Employee saved'); openPage('manage-employees'); }
function renderEmployees(){ const tbody = document.querySelector('#employees_table tbody'); if(!tbody) return; tbody.innerHTML=''; DB.employees.forEach(e=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${escapeHtml(e.name)}</td><td>${escapeHtml(e.role)}</td><td><button class=\"btn\" onclick=\"editEmployee(${e.id})\">Edit</button> <button class=\"btn\" style=\"background:#ef4444\" onclick=\"deleteEmployee(${e.id})\">Delete</button></td>`; tbody.appendChild(tr); }); }
function editEmployee(id){ const e = DB.employees.find(x=>x.id===id); if(!e) return; const name=prompt('Name',e.name); if(name===null) return; e.name=name; const role=prompt('Role',e.role); if(role===null) return; e.role=role; DB.save(); renderEmployees(); }
function deleteEmployee(id){ if(!confirm('Delete employee?')) return; DB.employees = DB.employees.filter(x=>x.id!==id); DB.save(); renderEmployees(); }

/* =====================
   BILLS (simple)
   ===================== */
function generateBill(){ const customer=document.getElementById('b_customer').value.trim(); const itemsStr=document.getElementById('b_items').value.trim(); if(!customer||!itemsStr) return alert('Fill fields'); const items = itemsStr.split(',').map(s=>{ const [n,p]=s.split(':'); return {name:n? n.trim():'', price: Number(p)||0}; }); const total = items.reduce((s,i)=>s+i.price,0); DB.bills.push({id:Date.now(),customer,items,total,date:new Date().toLocaleString()}); DB.save(); alert('Bill saved — total ₹'+total); openPage('today-sales'); }

// Init: show manage-products by default
openPage('manage-products');
</script>
</body>
</html>
