/* Eco Smart Mall — privacy-safe prototype. All state is local to this browser. */
'use strict';
(function () {
  const STORE_KEY = 'eco-smart-mall-demo-v2';
  const seed = {
    products: [
      {id:'honey',name:'Organic Mountain Honey',ar:'عسل جبلي عضوي',vendor:'Beit Al Mouna',price:24,stock:8,icon:'🍯'},
      {id:'oil',name:'Cold Pressed Olive Oil',ar:'زيت زيتون بكر',vendor:'Wadi Fresh',price:18.5,stock:12,icon:'🫒'},
      {id:'bowl',name:'Handcrafted Olive Bowl',ar:'وعاء خشب زيتون يدوي',vendor:'Qamar Crafts',price:32,stock:3,icon:'🪵'},
      {id:'soap',name:'Botanical Handmade Soap',ar:'صابون نباتي يدوي',vendor:'Green Roots',price:9.5,stock:0,icon:'🧼'},
      {id:'coffee',name:'Organic Coffee Beans',ar:'حبوب قهوة عضوية',vendor:'Wadi Fresh',price:16,stock:17,icon:'☕'},
      {id:'bag',name:'Reusable Cotton Tote',ar:'حقيبة قطن قابلة لإعادة الاستخدام',vendor:'Green Roots',price:12,stock:5,icon:'🛍️'}
    ],
    orders: [
      {id:'SMG-SAMPLE-001',items:[{id:'honey',qty:1}],status:'pending',payment:'unpaid',reserved:false,source:'sample'},
      {id:'SMG-SAMPLE-002',items:[{id:'oil',qty:2}],status:'cancelled',payment:'unpaid',reserved:false,source:'sample'}
    ],
    members:[{id:'M-001',name:'Demo Member',tier:'Bronze',points:149}],
    proposals:[{id:'G-001',title:'Prioritize reusable packaging',ar:'إعطاء الأولوية للتغليف القابل لإعادة الاستخدام',yes:11,no:3}],
    cart:[],voted:[],nextOrder:1
  };
  const $ = id => document.getElementById(id);
  const deepCopy = v => JSON.parse(JSON.stringify(v));
  const safe = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const currency = n => '$' + Number(n).toFixed(2);
  const load = () => {
    try {
      const stored=JSON.parse(localStorage.getItem(STORE_KEY));
      if(stored && Array.isArray(stored.products) && Array.isArray(stored.orders) && Array.isArray(stored.cart) && Array.isArray(stored.proposals)) return stored;
    } catch(e) {}
    return deepCopy(seed);
  };
  let db=load(),lang='ar',page='home',orderFilter='all',productQuery='';
  const T=(ar,en)=>lang==='ar'?ar:en;
  const product=id=>db.products.find(p=>p.id===id);
  const orderValue=o=>o.items.reduce((sum,i)=>sum+(product(i.id)?.price||0)*i.qty,0);
  const shopNames=()=>[...new Set(db.products.map(p=>p.vendor))];
  const statusText=s=>({pending:T('قيد الانتظار','Pending'),confirmed:T('مؤكد','Confirmed'),fulfilled:T('تم التسليم','Fulfilled'),cancelled:T('ملغي','Cancelled')})[s]||s;
  const navItems=[
    ['home','⌂','الرئيسية','Overview'],
    ['shop','◈','المتجر','Shop'],
    ['orders','▤','الطلبات','Orders'],
    ['inventory','▦','المخزون','Inventory'],
    ['members','♙','الأعضاء','Members'],
    ['vendors','▣','البائعون','Vendors'],
    ['governance','⚖','التصويت','Governance'],
    ['transparency','◷','الشفافية','Transparency']
  ];
  function save(){try{localStorage.setItem(STORE_KEY,JSON.stringify(db));}catch(e){notify(T('تعذر حفظ البيانات في المتصفح','Local browser storage unavailable'));}}
  function notify(msg){const n=$('notice');n.textContent='⚠ '+msg;}
  function pill(value,warning=false){return '<span class="pill'+(warning?' warn':'')+'">'+safe(value)+'</span>';}
  function button(action,label,id='',cls='btn small',disabled=false){
    return '<button type="button" class="'+cls+'" data-action="'+safe(action)+'" data-id="'+safe(id)+'" '+(disabled?'disabled':'')+'>'+label+'</button>';
  }
  function heading(title,desc){return '<div class="eyebrow">ECO SMART MALL</div><h1>'+title+'</h1><p class="lede">'+desc+'</p>';}
  function stat(label,value,detail=''){return '<div class="card metric">'+label+'<strong>'+value+'</strong><small>'+detail+'</small></div>';}
  function render(){
    document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    $('lang').textContent=T('English','العربية');
    $('tagline').textContent=T('تجارة أكثر عدالة واستدامة','Fairer, more sustainable commerce');
    $('sidefoot').textContent=T('وضع تجريبي — لا حسابات أو بطاقات حقيقية','Demo mode — no real accounts or cards');
    $('footnote').textContent=T('حفظ محلي على جهازك فقط','Saved locally on your device only');
    document.querySelector('[data-i18n=demo]').textContent=T('نسخة تجريبية','DEMO');
    $('notice').textContent='⚠ '+T('موقع تجريبي فقط، لا يتصل بـ Glide أو خدمات دفع. البيانات المحلية ليست سجلاً تجارياً.','Prototype only; no Glide or payment connection. Local data is not a commercial ledger.');
    $('cartCount').textContent=db.cart.reduce((s,i)=>s+i.qty,0);
    $('nav').innerHTML=navItems.map(([id,icon,ar,en])=>'<button type="button" data-page="'+id+'" class="'+(id===page?'current':'')+'" aria-current="'+(id===page?'page':'false')+'">'+icon+' &nbsp;'+T(ar,en)+'</button>').join('');
    const views={home,shop,orders,inventory,members,vendors,governance,transparency};
    $('view').innerHTML=(views[page]||home)();
  }
  function home(){
    const low=db.products.filter(x=>x.stock<=3).length, pending=db.orders.filter(x=>x.status==='pending').length;
    return '<section class="hero"><div><div class="eyebrow" style="color:#d3efae">COOPERATIVE • SUSTAINABLE • TRANSPARENT</div><h1>'+T('تجارة ذكية تعود بالنفع على الجميع','Smarter commerce. Shared value.')+'</h1><p>'+T('تجربة تفاعلية لمول تعاوني متعدد البائعين، بعضوية وشفافية وحوكمة ديمقراطية.','Explore a cooperative multi-vendor mall with membership, transparent reporting and democratic participation.')+'</p>'+button('goShop',T('تصفح المتجر ←','Explore products →'),'','btn')+'</div><div class="hero-art" aria-hidden="true">🌿🏬</div></section>'+
    '<div class="cards">'+stat(T('الطلبات التجريبية','Demo orders'),db.orders.length)+stat(T('بانتظار التأكيد','Awaiting confirmation'),pending)+stat(T('تنبيهات المخزون','Stock alerts'),low)+stat(T('المتاجر','Stores'),shopNames().length)+'</div>'+
    '<div class="sectionhead"><h2>'+T('كيف يعمل النظام؟','How it works')+'</h2></div><div class="cards">'+
    '<div class="card"><div class="symbol">🛒</div><h3>'+T('تجربة الطلبات','Test orders')+'</h3><p>'+T('أضف منتجات للسلة وأنشئ طلباً وهمياً، ثم جرّب تأكيده أو إلغاءه.','Add products to your cart, create a sample order, then confirm or cancel it.')+'</p></div>'+
    '<div class="card"><div class="symbol">📦</div><h3>'+T('مراقبة المخزون','Inventory alerts')+'</h3><p>'+T('يُحجز المخزون تلقائياً للطلبات الجديدة وتتم إعادته عند إلغائها.','Stock is reserved on demo checkout and restored when a reserved order is cancelled.')+'</p></div>'+
    '<div class="card"><div class="symbol">🗳️</div><h3>'+T('قرار تشاركي','Participatory decisions')+'</h3><p>'+T('صوّت على مقترح تجريبي وشاهد النتيجة المحلية.','Vote on a demo proposal and view its local results.')+'</p></div></div>';
  }
  function shop(){
    const ps=db.products.filter(p=>(p.name+' '+p.ar+' '+p.vendor).toLowerCase().includes(productQuery.toLowerCase()));
    return heading(T('المتجر المستدام','Sustainable marketplace'),T('منتجات توضيحية من متاجر مستقلة — الأسعار بالدولار لأغراض العرض فقط.','Illustrative products from independent vendors. USD prices are placeholders.'))+
    '<div class="panel formline"><label>'+T('بحث المنتجات','Search products')+' <input id="searchProducts" class="filter" value="'+safe(productQuery)+'" placeholder="'+T('ابحث بالاسم أو المتجر','Search name or vendor')+'"></label>'+button('openCart',T('عرض السلة','View cart')+' ('+db.cart.reduce((s,i)=>s+i.qty,0)+')','','btn')+'</div>'+
    '<div class="cards">'+ps.map(p=>'<article class="card product"><div class="symbol">'+p.icon+'</div><h3>'+safe(T(p.ar,p.name))+'</h3><p>'+safe(p.vendor)+'</p><div class="meta"><span class="price">'+currency(p.price)+'</span>'+pill(p.stock===0?T('غير متاح','Sold out'):T('متاح','In stock')+' '+p.stock,p.stock<=3)+'</div><div style="margin-top:18px">'+button('add',T('إضافة للسلة','Add to cart'),p.id,'btn',p.stock===0)+'</div></article>').join('')+'</div>'+(ps.length?'':'<p class="empty">'+T('لا توجد نتائج','No products found')+'</p>');
  }
  function orders(){
    let rows=db.orders.filter(o=>orderFilter==='all'||o.status===orderFilter);
    return heading(T('إدارة الطلبات','Order management'),T('تحديث حالات الطلبات التجريبية فقط. لا تتم أي عمليات دفع.','Manage only demo orders. Payments are never processed.'))+
    '<div class="panel"><label>'+T('حالة الطلب','Order status')+' <select id="orderFilter" class="filter"><option value="all">'+T('جميع الحالات','All statuses')+'</option>'+['pending','confirmed','fulfilled','cancelled'].map(s=>'<option value="'+s+'" '+(s===orderFilter?'selected':'')+'>'+statusText(s)+'</option>').join('')+'</select></label><div class="tablewrap"><table class="table orders-table"><thead><tr><th>ID</th><th>'+T('المصدر','Source')+'</th><th>'+T('الإجمالي','Total')+'</th><th>'+T('الحالة','Status')+'</th><th>'+T('الدفع','Payment')+'</th><th>'+T('إجراءات','Actions')+'</th></tr></thead><tbody>'+
    rows.map(o=>'<tr><td data-label="ID"><strong>'+safe(o.id)+'</strong></td><td data-label="'+T('المصدر','Source')+'">'+safe(o.source)+'</td><td data-label="'+T('الإجمالي','Total')+'">'+currency(orderValue(o))+'</td><td data-label="'+T('الحالة','Status')+'">'+pill(statusText(o.status),o.status==='pending')+'</td><td data-label="'+T('الدفع','Payment')+'">'+pill(T('غير مدفوع','Unpaid'))+'</td><td data-label="'+T('إجراءات','Actions')+'"><div class="actions">'+(o.status==='pending'?button('confirm',T('تأكيد','Confirm'),o.id,'btn small'):'')+(o.status==='confirmed'?button('fulfill',T('إكمال','Fulfill'),o.id,'btn small'):'')+(['pending','confirmed'].includes(o.status)?button('cancel',T('إلغاء','Cancel'),o.id,'btn-outline small'):'')+'</div></td></tr>').join('')+'</tbody></table></div>'+(rows.length?'':'<p class="empty">'+T('لا توجد طلبات مطابقة','No matching orders')+'</p>')+'</div>'+
    '<p class="muted">'+T('الطلبات القديمة التجريبية لا تحجز مخزوناً. الطلبات المنشأة من السلة فقط تحجز مخزوناً، ويُسترد مرة واحدة عند الإلغاء.','Existing sample orders do not reserve stock. Only cart-created orders reserve inventory, which is restored once on cancellation.')+'</p>';
  }
  function inventory(){
    return heading(T('المخزون والتنبيهات','Inventory & alerts'),T('تتبع كميات تجريبية، مع تنبيه عند 3 وحدات أو أقل.','Track illustrative stock with alerts at three units or fewer.'))+
    '<div class="cards">'+stat(T('أصناف المنتجات','Product SKUs'),db.products.length)+stat(T('إجمالي الوحدات','Total units'),db.products.reduce((s,p)=>s+p.stock,0))+stat(T('مخزون منخفض','Low stock'),db.products.filter(p=>p.stock>0&&p.stock<=3).length)+stat(T('نفد المخزون','Out of stock'),db.products.filter(p=>p.stock===0).length)+'</div>'+
    '<div class="panel tablewrap"><table class="table"><thead><tr><th>SKU</th><th>'+T('المنتج','Product')+'</th><th>'+T('البائع','Vendor')+'</th><th>'+T('الكمية','Quantity')+'</th><th>'+T('التنبيه','Alert')+'</th></tr></thead><tbody>'+
    db.products.map(p=>'<tr><td>'+p.id+'</td><td>'+safe(T(p.ar,p.name))+'</td><td>'+safe(p.vendor)+'</td><td>'+p.stock+'</td><td>'+pill(p.stock===0?T('نفد','Out'):p.stock<=3?T('منخفض','Low'):T('طبيعي','Normal'),p.stock<=3)+'</td></tr>').join('')+'</tbody></table></div>';
  }
  function members(){return heading(T('العضوية والمزايا','Membership & benefits'),T('عضويات ومستويات ونقاط تجريبية دون حسابات مستخدمين حقيقية.','Sample membership tiers and points without real user accounts.'))+
    '<div class="cards">'+db.members.map(m=>'<div class="card"><div class="symbol">🥉</div><h2>'+safe(m.name)+'</h2><p>'+T('العضوية','Tier')+': '+safe(m.tier)+'</p><div class="metric">'+T('النقاط','Points')+'<strong>'+m.points+'</strong></div></div>').join('')+'</div><div class="panel"><h3>'+T('الخطوة التالية','Next milestone')+'</h3><p>'+T('ربط النقاط لاحقاً بسجل معاملات قابل للتدقيق، بعد تحديد قواعد الكسب والاستبدال.','Implement a verifiable points ledger once earning and redemption policies are approved.')+'</p></div>';}
  function vendors(){return heading(T('المتاجر والبائعون','Stores & vendors'),T('قائمة توضيحية لمتاجر مستقلة، لا توجد حسابات بائعين مفعّلة.','Sample independent stores; no vendor accounts are active.'))+
    '<div class="cards">'+shopNames().map((s,i)=>'<div class="card"><div class="symbol">'+['🌱','🫒','🧺','♻️'][i%4]+'</div><h3>'+safe(s)+'</h3><p>'+T('عدد المنتجات','Products')+': '+db.products.filter(p=>p.vendor===s).length+'</p>'+pill(T('بيانات تجريبية','Sample'))+'</div>').join('')+'</div>';}
  function governance(){return heading(T('القرار الديمقراطي','Democratic governance'),T('محاكاة تعليمية للتصويت. النتائج ليست تصويتاً قانونياً أو موثق الهوية.','Educational mock voting only; results are neither legally binding nor identity-verified.'))+
    '<div class="cards">'+db.proposals.map(p=>'<div class="card"><div class="symbol">🗳️</div><h3>'+safe(T(p.ar,p.title))+'</h3><p>'+T('موافق','Yes')+': '+p.yes+' · '+T('رافض','No')+': '+p.no+'</p><p>'+T('مشاركة محلية واحدة لكل متصفح في العرض','One local vote per browser in this demo')+'</p><div class="actions">'+button('voteYes',T('موافق','Yes'),p.id,'btn small',db.voted.includes(p.id))+button('voteNo',T('رافض','No'),p.id,'btn-outline small',db.voted.includes(p.id))+'</div></div>').join('')+'</div>';}
  function transparency(){
    const total=db.orders.reduce((s,o)=>s+orderValue(o),0);
    return heading(T('الشفافية والمحاسبة','Transparency & accountability'),T('عرض واضح لما هو تجريبي، وما لم يتم تشغيله بعد.','Clear separation of simulated metrics from real operational data.'))+
    '<div class="cards">'+stat(T('قيمة الطلبات التجريبية','Gross demo order value'),currency(total))+stat(T('مدفوعات محصلة','Payments collected'),'$0.00')+stat(T('عدد العقود الذكية المفعّلة','Live smart contracts'),'0')+stat(T('مشاريع متصلة فعلياً','Live connected projects'),'0')+'</div>'+
    '<div class="panel"><h2>'+T('حدود الشفافية الحالية','Current reporting boundaries')+'</h2><ul class="steps"><li>'+T('لا توجد حسابات بنكية أو معاملات حقيقية','No bank accounts or real transactions')+'</li><li>'+T('لا توجد سجلات ملكية أو أصول مدققة','No audited asset ownership records')+'</li><li>'+T('لا توجد مصادقة للأعضاء أو توقيعات للتصويت','No verified member authentication or voting signatures')+'</li><li>'+T('لا يوجد ربط مع Glide، ولا تزامن تلقائي','No Glide integration or automated synchronization')+'</li></ul>'+button('reset',T('إعادة تعيين جميع البيانات التجريبية','Reset all demo data'),'','btn-outline')+'</div>';
  }
  function dialog(title,content){$('dialogTitle').textContent=title;$('dialogContent').innerHTML=content;$('dialog').classList.remove('hidden');$('closeDialog').focus();}
  function closeDialog(){$('dialog').classList.add('hidden');$('cartBtn').focus();}
  function showCart(){
    const lines=db.cart.map(i=>{const p=product(i.id);return '<div class="cart-row"><div><strong>'+safe(T(p.ar,p.name))+'</strong><br><small>'+currency(p.price)+' × '+i.qty+'</small></div><div class="actions">'+button('minus','−',i.id,'btn-outline small')+button('plus','+',i.id,'btn-outline small',i.qty>=p.stock)+button('remove','✕',i.id,'btn-outline small')+'</div></div>';}).join('');
    const sum=db.cart.reduce((s,i)=>s+product(i.id).price*i.qty,0);
    dialog(T('سلة التسوق التجريبية','Demo cart'),lines||'<p class="empty">'+T('السلة فارغة','Your cart is empty')+'</p>');
    $('dialogContent').insertAdjacentHTML('beforeend','<p><strong>'+T('الإجمالي','Total')+': '+currency(sum)+'</strong></p>'+button('checkout',T('إنشاء طلب تجريبي غير مدفوع','Create unpaid demo order'),'','btn',!db.cart.length));
  }
  function add(id){
    const p=product(id),entry=db.cart.find(i=>i.id===id);if(!p)return;
    if(p.stock<=(entry?.qty||0)){notify(T('الكمية المتاحة غير كافية','Not enough available stock'));return;}
    if(entry)entry.qty++;else db.cart.push({id,qty:1});save();render();notify(T('تمت الإضافة للسلة التجريبية','Added to demo cart'));
  }
  function changeQty(id,delta){
    const entry=db.cart.find(i=>i.id===id),p=product(id);if(!entry||!p)return;
    entry.qty+=delta;if(entry.qty<=0)db.cart=db.cart.filter(i=>i.id!==id);
    else if(entry.qty>p.stock)entry.qty=p.stock;
    save();render();showCart();
  }
  function checkout(){
    if(!db.cart.length)return;
    if(!db.cart.every(i=>Number.isInteger(i.qty)&&i.qty>0&&product(i.id)&&product(i.id).stock>=i.qty)){notify(T('راجع المخزون، الطلب لم يُنشأ','Check stock; order was not created'));return;}
    const items=deepCopy(db.cart);
    items.forEach(i=>{product(i.id).stock-=i.qty;});
    const id='ECO-DEMO-'+String(db.nextOrder++).padStart(4,'0');
    db.orders.unshift({id,items,status:'pending',payment:'unpaid',reserved:true,source:'demo'});
    db.cart=[];save();closeDialog();page='orders';render();notify(T('تم إنشاء طلب تجريبي غير مدفوع: ','Created unpaid demo order: ')+id);
  }
  function transition(id,action){
    const o=db.orders.find(x=>x.id===id);if(!o)return;
    if(action==='confirm'&&o.status==='pending')o.status='confirmed';
    else if(action==='fulfill'&&o.status==='confirmed')o.status='fulfilled';
    else if(action==='cancel'&&['pending','confirmed'].includes(o.status)){
      if(o.reserved){o.items.forEach(i=>{const p=product(i.id);if(p)p.stock+=i.qty;});o.reserved=false;}
      o.status='cancelled';
    }else return;
    save();render();
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.id==='lang'){lang=lang==='ar'?'en':'ar';render();return;}
    if(b.id==='cartBtn'){showCart();return;}
    if(b.id==='closeDialog'){closeDialog();return;}
    if(b.dataset.page){page=b.dataset.page;render();window.scrollTo(0,0);return;}
    const {action,id}=b.dataset;if(!action)return;
    if(action==='goShop'){page='shop';render();return;}
    if(action==='openCart'){showCart();return;}
    if(action==='add'){add(id);return;}
    if(action==='plus'){changeQty(id,1);return;}
    if(action==='minus'){changeQty(id,-1);return;}
    if(action==='remove'){db.cart=db.cart.filter(i=>i.id!==id);save();render();showCart();return;}
    if(action==='checkout'){checkout();return;}
    if(['confirm','cancel','fulfill'].includes(action)){transition(id,action);return;}
    if(action==='voteYes'||action==='voteNo'){
      if(db.voted.includes(id))return;
      const p=db.proposals.find(x=>x.id===id);if(!p)return;
      p[action==='voteYes'?'yes':'no']++;db.voted.push(id);save();render();return;
    }
    if(action==='reset'){
      if(window.confirm(T('هل تريد حذف كل بيانات العرض المحفوظة على هذا الجهاز؟','Delete all locally stored demo changes on this device?'))){
        db=deepCopy(seed);save();render();
      }
    }
  });
  document.addEventListener('input',e=>{if(e.target.id==='searchProducts'){productQuery=e.target.value;const pos=e.target.selectionStart;render();const input=$('searchProducts');input.focus();input.setSelectionRange(pos,pos);}});
  document.addEventListener('change',e=>{if(e.target.id==='orderFilter'){orderFilter=e.target.value;render();}});
  $('dialog').addEventListener('click',e=>{if(e.target===$('dialog'))closeDialog();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('dialog').classList.contains('hidden'))closeDialog();});
  render();
})();
