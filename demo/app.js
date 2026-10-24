'use strict';
const seed={
 products:[
  {id:'P1',name:'Organic Wild Mountain Honey',price:24,stock:8,vendor:'Beit Al-Mouna Pantry'},
  {id:'P2',name:'Olive Oil 750ml',price:18.5,stock:2,vendor:'Wadi Fresh Produce'},
  {id:'P3',name:'Olive Wood Bowl',price:32,stock:0,vendor:'Qamar Artisan Crafts'}],
 orders:[
  {id:'SMG-20261016-GF34AL',customer:'Demo Customer',items:[{sku:'P1',qty:1}],status:'pending',payment:'unpaid'},
  {id:'SMG-20261016-6EUNJ7',customer:'Demo Customer',items:[{sku:'P2',qty:2}],status:'cancelled',payment:'unpaid'}],
 members:[{id:'M1',name:'Demo Member',tier:'Bronze',points:149}]
};
const data=structuredClone(seed);
let language='ar',tab='orders',filter='all';
const $=id=>document.getElementById(id);
const t=(ar,en)=>language==='ar'?ar:en;
const money=n=>'$'+n.toFixed(2);
const product=id=>data.products.find(p=>p.id===id);
const total=o=>o.items.reduce((s,i)=>s+(product(i.sku)?.price||0)*i.qty,0);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const statuses=['pending','confirmed','fulfilled','cancelled'];
function render(){
 document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';
 $('lang').textContent=t('English','العربية');
 $('subtitle').textContent=t('لوحة المالك التجريبية','Demo owner dashboard');
 $('notice').textContent=t('بيانات تجريبية فقط — لا مدفوعات حقيقية ولا اتصال بـ Glide','Demo data only — no real payments or Glide connection');
 $('stats').innerHTML=[
  [t('الطلبات','Orders'),data.orders.length],
  [t('غير مدفوع','Unpaid'),data.orders.filter(o=>o.payment==='unpaid').length],
  [t('تنبيهات المخزون','Stock alerts'),data.products.filter(p=>p.stock<=2).length],
  [t('الأعضاء','Members'),data.members.length]
 ].map(([k,v])=>`<div class="card"><small>${k}</small><h2>${v}</h2></div>`).join('');
 const labels={orders:t('الطلبات','Orders'),products:t('المنتجات والمخزون','Products & stock'),members:t('الأعضاء','Members'),stores:t('المتاجر','Stores')};
 $('tabs').innerHTML=Object.keys(labels).map(x=>`<button type="button" class="${tab===x?'active':''}" data-tab="${x}">${labels[x]}</button>`).join('');
 $('content').innerHTML=({orders:ordersView,products:productsView,members:membersView,stores:storesView})[tab]();
}
function ordersView(){
 return `<div class="card">
 <label>${t('تصفية الحالة','Filter status')} <select id="filter">
 <option value="all">${t('الكل','All')}</option>
 ${statuses.map(x=>`<option value="${x}" ${filter===x?'selected':''}>${x}</option>`).join('')}
 </select></label>
 <div class="scroll"><table><thead><tr>
 <th>ID</th><th>${t('العميل','Customer')}</th><th>${t('الإجمالي','Total')}</th><th>${t('الدفع','Payment')}</th><th>${t('الحالة','Status')}</th><th>${t('إجراء','Action')}</th>
 </tr></thead><tbody>
 ${data.orders.filter(o=>filter==='all'||o.status===filter).map(o=>`<tr>
 <td>${esc(o.id)}</td><td>${esc(o.customer)}</td><td>${money(total(o))}</td>
 <td>${esc(o.payment)}</td><td><span class="tag">${esc(o.status)}</span></td>
 <td>${o.status==='pending'?`<button type="button" data-action="confirm" data-id="${esc(o.id)}">${t('تأكيد','Confirm')}</button> `:''}
 ${['pending','confirmed'].includes(o.status)?`<button type="button" data-action="cancel" data-id="${esc(o.id)}">${t('إلغاء','Cancel')}</button>`:''}</td></tr>`).join('')}
 </tbody></table></div></div>
 <small>${t('طلبات العينة لم تخصم مخزونًا، لذلك الإلغاء لا يغيّر المخزون.','Sample orders did not reserve stock; cancellation does not change stock.')}</small>`;
}
function productsView(){return `<div class="cards">${data.products.map(p=>`<article class="card"><h3>${esc(p.name)}</h3><p>${esc(p.vendor)}</p><p>${money(p.price)}</p><strong>${t('المتاح','In stock')}: ${p.stock}</strong> ${p.stock<=2?`<span class="tag">${t('تنبيه','Alert')}</span>`:''}</article>`).join('')}</div>`;}
function membersView(){return data.members.map(m=>`<div class="card"><h3>${esc(m.name)}</h3><p>${esc(m.tier)} • ${m.points} ${t('نقطة','points')}</p></div>`).join('');}
function storesView(){return [...new Set(data.products.map(p=>p.vendor))].map(s=>`<div class="card">${esc(s)}</div>`).join('');}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='lang'){language=language==='ar'?'en':'ar';render();return;}
 if(b.dataset.tab){tab=b.dataset.tab;render();return;}
 if(b.dataset.action){
  const o=data.orders.find(x=>x.id===b.dataset.id);if(!o)return;
  if(b.dataset.action==='confirm'&&o.status==='pending')o.status='confirmed';
  if(b.dataset.action==='cancel'&&['pending','confirmed'].includes(o.status))o.status='cancelled';
  render();
 }
});
document.addEventListener('change',e=>{if(e.target.id==='filter'){filter=e.target.value;render();}});
render();