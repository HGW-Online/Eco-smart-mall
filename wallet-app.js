import {isGnoAddress,getGnoAccount,explorerLink} from "./gno-land.js";
export const CHAINS=[
 {id:"1",name:"Ethereum",ticker:"ETH",rpc:"https://ethereum-rpc.publicnode.com",explorer:"https://etherscan.io"},
 {id:"8453",name:"Base",ticker:"ETH",rpc:"https://mainnet.base.org",explorer:"https://basescan.org"},
 {id:"100",name:"Gnosis",ticker:"xDAI",rpc:"https://rpc.gnosischain.com",explorer:"https://gnosisscan.io"},
 {id:"42220",name:"Celo",ticker:"CELO",rpc:"https://forno.celo.org",explorer:"https://celoscan.io"},
 {id:"11142220",name:"Celo Sepolia (test)",ticker:"CELO",rpc:"https://forno.celo-sepolia.celo-testnet.org",explorer:"https://celo-sepolia.blockscout.com"}
];
const DEFAULT="0x1bea1c51c721a0d10eceaa7de9693d1e07454df9",GNO="g1zhwyfs8f8hjd50y28fcn05ew5d6mtz0vkh6h8v";
const $=(id)=>document.getElementById(id);
const validEvm=x=>/^0x[a-fA-F0-9]{40}$/.test(x);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const state={address:DEFAULT,tokens:[],provider:null,watch:[]};
function setStatus(text){$("status").textContent=text}
function load(){try{let x=JSON.parse(localStorage.getItem("hgw-watch-v2")||"{}");if(validEvm(x.address))state.address=x.address;if(Array.isArray(x.tokens))state.tokens=x.tokens.filter(t=>CHAINS.some(c=>c.id===t.chain)&&validEvm(t.address)).slice(0,100);state.watch=Array.isArray(x.watch)?x.watch.filter(validEvm).slice(0,30):[]}catch{};$("address").value=state.address;$("gno").value=GNO}
function save(){localStorage.setItem("hgw-watch-v2",JSON.stringify({address:state.address,tokens:state.tokens,watch:state.watch}))}
function rpc(chain,method,params){const ac=new AbortController();const timer=setTimeout(()=>ac.abort(),14000);return fetch(chain.rpc,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method,params}),signal:ac.signal}).finally(()=>clearTimeout(timer)).then(async r=>{if(!r.ok)throw Error("RPC HTTP "+r.status);let j=await r.json();if(j.error)throw Error(j.error.message||"RPC rejected");if(j.result==null)throw Error("No result");return j.result})}
const balanceSelector="0x70a08231",decimalsSelector="0x313ce567",symbolSelector="0x95d89b41";
const format=(hex,decimals=18)=>{let n=BigInt(hex),d=10n**BigInt(decimals),fraction=String(n%d).padStart(decimals,"0").slice(0,6).replace(/0+$/,"");return String(n/d)+(fraction?"."+fraction:"")};
async function readToken(t,owner){const chain=CHAINS.find(c=>c.id===t.chain);const data=balanceSelector+owner.slice(2).padStart(64,"0");const value=await rpc(chain,"eth_call",[{to:t.address,data},"latest"]);return format(value,t.decimals)};
function showTokens(){const area=$("tokens");area.replaceChildren();for(const [i,t] of state.tokens.entries()){const item=document.createElement("div");item.className="token";const chain=CHAINS.find(c=>c.id===t.chain);const txt=document.createElement("span");txt.textContent=(t.symbol||"TOKEN")+" — "+chain.name+" · "+t.address.slice(0,8)+"…"+t.address.slice(-5);const btn=document.createElement("button");btn.textContent="حذف";btn.className="small danger";btn.onclick=()=>{state.tokens.splice(i,1);save();showTokens()};item.append(txt,btn);area.append(item)}}
async function scan(){const address=$("address").value.trim();if(!validEvm(address)){setStatus("عنوان EVM غير صالح");return}state.address=address;save();const area=$("results");area.replaceChildren();setStatus("جاري قراءة الأرصدة العامة على الشبكات...");const data=await Promise.all(CHAINS.map(async c=>{try{return {chain:c,balance:format(await rpc(c,"eth_getBalance",[address,"latest"])),error:null}}catch(e){return {chain:c,error:e.message}}}));for(const d of data){const line=document.createElement("div");line.className="result";const a=document.createElement("a");a.href=d.chain.explorer+"/address/"+address;a.target="_blank";a.rel="noopener noreferrer";a.textContent=d.chain.name;const value=document.createElement("span");value.textContent=d.error?"تعذر RPC — افتح المستكشف ←":d.balance+" "+d.chain.ticker;line.append(a,value);area.append(line)}for(const t of state.tokens){const line=document.createElement("div");line.className="result";const a=document.createElement("a");const c=CHAINS.find(c=>c.id===t.chain);a.href=c.explorer+"/token/"+t.address+"?a="+address;a.rel="noopener noreferrer";a.target="_blank";a.textContent=(t.symbol||"Token")+" / "+c.name;const v=document.createElement("span");v.textContent="جاري الفحص...";line.append(a,v);area.append(line);readToken(t,address).then(value=>v.textContent=value+" "+(t.symbol||"TOKEN")).catch(()=>v.textContent="تعذر قراءة التوكن")}setStatus("اكتمل فحص الأرصدة الأصلية. لا يوجد تسعير سوقي أو إثبات ملكية مفاتيح.") }
async function addToken(){const c=$("chain").value,addr=$("contract").value.trim();if(!validEvm(addr)){setStatus("عنوان عقد التوكن غير صالح");return}if(state.tokens.some(t=>t.chain===c&&t.address.toLowerCase()===addr.toLowerCase())){setStatus("التوكن مُضاف بالفعل");return}const chain=CHAINS.find(x=>x.id===c);setStatus("جاري التحقق من عقد ERC-20...");try{const value=await rpc(chain,"eth_call",[{to:addr,data:decimalsSelector},"latest"]);const decimals=Number(BigInt(value));if(decimals<0||decimals>36)throw Error("Decimals not supported");const symbol=$("symbol").value.trim().slice(0,16)||"TOKEN";state.tokens.push({chain:c,address:addr,decimals,symbol});save();showTokens();setStatus("تم إضافة التوكن للمتابعة فقط (لا يُنشر أو يُستورد إلى المحفظة).")}catch(e){setStatus("تعذر التحقق من ERC-20: "+e.message)}}
async function connect(){const provider=window.ethereum;if(!provider?.request){setStatus("لم يتم العثور على محفظة متصلة داخل هذا المتصفح. افتح الموقع من متصفح MetaMask/Rabby أو استخدم متابعة العنوان.");return}try{const accounts=await provider.request({method:"eth_requestAccounts"});if(accounts?.[0]&&validEvm(accounts[0])){state.provider=provider;$("address").value=accounts[0];setStatus("تم الاتصال بالمحفظة للقراءة فقط. لا توقيع أو تحويل.");await scan()}}catch(e){setStatus("لم يتم الربط: "+e.message)}}
async function gnoScan(){const address=$("gno").value.trim();if(!isGnoAddress(address)){$("gnoResult").textContent="عنوان g1 غير صالح";return}const a=$("gnoExplorer");a.href=explorerLink(address);$("gnoResult").textContent="جاري الفحص...";try{const r=await getGnoAccount(address);$("gnoResult").textContent=r.found?JSON.stringify(r.account,null,2):"لا توجد بيانات حساب متاحة من RPC"}catch(e){$("gnoResult").textContent="تعذر الفحص عبر المتصفح. راجع المستكشف الرسمي: "+e.message}}
document.addEventListener("DOMContentLoaded",()=>{load();for(const c of CHAINS){const opt=document.createElement("option");opt.value=c.id;opt.textContent=c.name;$("chain").append(opt)}showTokens();$("scan").onclick=scan;$("connect").onclick=connect;$("add").onclick=addToken;$("gnoScan").onclick=gnoScan;$("gnoExplorer").href=explorerLink(GNO);$("clear").onclick=()=>{if(confirm("مسح العناوين والتوكنات العامة المحفوظة محليًا؟")){localStorage.removeItem("hgw-watch-v2");state.tokens=[];state.address=DEFAULT;load();showTokens();$("results").replaceChildren();setStatus("تم مسح بيانات المتابعة المحلية")}}});

function renderWatch(){
 const area=document.getElementById("watchList"); if(!area)return;area.replaceChildren();
 for(const addr of [...new Set([state.address,...state.watch])]){
  const d=document.createElement("div");d.className="result";const name=document.createElement("span");name.textContent=addr===state.address?"الأساسية: "+addr:"متابعة: "+addr;
  const b=document.createElement("button");b.className="small secondary";b.textContent="عرض";b.onclick=()=>{document.getElementById("address").value=addr;scan()};
  d.append(name,b);area.append(d);
 }
}
function addWatch(){const el=document.getElementById("watchInput");const a=el.value.trim();if(!validEvm(a)){setStatus("العنوان غير صالح، مطلوب 0x مع 40 رقم/حرف");return}if(!state.watch.some(x=>x.toLowerCase()===a.toLowerCase()))state.watch.push(a);save();renderWatch();el.value="";setStatus("تمت إضافة عنوان للمتابعة فقط. لم يتم نقل أو دمج أي أصول.")}
function populatePresets(){
 const presets=[
  {name:"YJM on Gnosis",chain:"100",address:"0x81765e9e44C16C7E8f52952b8936F5e715e04625",symbol:"YJM",decimals:18},
  {name:"HGW on Celo Sepolia (TEST)",chain:"11142220",address:"0x35faAa8C0ACE3a99cdB3D9f05889109323d555E3",symbol:"HGW",decimals:18}
 ];
 const box=document.getElementById("knownTokens");if(!box)return;
 for(const t of presets){
  const b=document.createElement("button");b.textContent=t.name;b.className="secondary";
  b.onclick=()=>{if(!state.tokens.some(x=>x.chain===t.chain&&x.address.toLowerCase()===t.address.toLowerCase())){state.tokens.push({chain:t.chain,address:t.address,symbol:t.symbol,decimals:t.decimals});save();showTokens()}setStatus(t.symbol+" تمت إضافته للمتابعة. المصدر: العقد المعروف، والاستعلام المباشر قد يفشل على iOS.")};
  box.append(b);
 }
}
document.addEventListener("DOMContentLoaded",()=>{
 document.getElementById("addWatch")?.addEventListener("click",addWatch);
 renderWatch();populatePresets();
 document.getElementById("quickGno")?.addEventListener("click",()=>window.open("https://gnoscan.io/","_blank","noopener"));
});

async function showAlchemySnapshot(){
 const root=document.getElementById("alchemySnapshot");if(!root)return;
 try{
  const response=await fetch("./alchemy-snapshot.json",{cache:"no-store"});
  if(!response.ok)throw Error("Snapshot HTTP "+response.status);
  const data=await response.json();if(data.schema!=="hgw-wallet-snapshot-v1")throw Error("Unknown data format");
  root.replaceChildren();
  const header=document.createElement("p");
  header.className="muted";
  header.textContent="العنوان: "+data.address+" · المصدر: Alchemy · التاريخ: "+data.retrievedDateUTC;
  root.append(header);
  for(const item of data.networkBalances){
    const row=document.createElement("div");row.className="result";
    const name=document.createElement("strong");name.textContent=item.chain;
    const value=document.createElement("span");value.textContent=format(item.wei)+" "+item.native;
    row.append(name,value);root.append(row);
  }
  for(const item of data.verifiedErc20){
    const row=document.createElement("div");row.className="result";
    const name=document.createElement("strong");name.textContent=item.symbol+" ("+item.network+")";
    const value=document.createElement("span");value.textContent=format(item.rawBalance,item.decimals)+" "+item.symbol;
    row.append(name,value);root.append(row);
  }
  const warning=document.createElement("p");warning.className="warn";
  warning.textContent="هذه لقطة أرصدة عامة وليست تحديثًا حيًا أو تقديرًا نقديًا؛ لا تتضمن الحسابات غير المتوافقة مع EVM مثل Gno.land.";
  root.append(warning);
 }catch(err){root.textContent="تعذر قراءة لقطة Alchemy: "+err.message;}
}
document.addEventListener("DOMContentLoaded",showAlchemySnapshot);
