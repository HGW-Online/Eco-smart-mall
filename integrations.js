// HGW integration adapter: EIP-6963 injected wallets, safe read-only connection.
// Never requests signatures, seed phrases or private keys.
const readyProviders = new Map();
function announceWallets() {
  const list=document.getElementById("walletProviders");
  if (!list) return;
  list.replaceChildren();
  if(!readyProviders.size){
    const info=document.createElement("p");
    info.textContent="لا توجد محفظة EVM مكتشفة في المتصفح الحالي. جرّب فتح الموقع من متصفح MetaMask أو Rabby، أو استخدم المتابعة بالعنوان.";
    list.append(info);
  }
  for(const [id,entry] of readyProviders){
    const button=document.createElement("button");
    button.className="secondary";
    button.textContent="اتصال للقراءة: "+entry.info.name;
    button.addEventListener("click",async()=>{
      const status=document.getElementById("integrationStatus");
      try{
        const addresses=await entry.provider.request({method:"eth_requestAccounts"});
        if(!Array.isArray(addresses)||!/^0x[0-9a-fA-F]{40}$/.test(addresses[0]||""))throw Error("No valid account selected");
        const address=addresses[0];
        document.getElementById("address").value=address;
        status.textContent="تم ربط "+entry.info.name+" للقراءة. العنوان: "+address+" — لا توقيع ولا إرسال.";
        document.getElementById("scan").click();
      }catch(e){status.textContent="تعذر الربط: "+(e.message||String(e));}
    });
    list.append(button);
  }
}
window.addEventListener("eip6963:announceProvider",event=>{
  const {info,provider}=event.detail||{};
  if(!info||!provider?.request||typeof info.rdns!=="string")return;
  readyProviders.set(info.uuid||info.rdns,{info,provider});
  announceWallets();
});
window.dispatchEvent(new Event("eip6963:requestProvider"));
function initIntegrations(){
  const status=document.getElementById("integrationStatus");
  const eip=window.ethereum;
  if(eip?.request&&!readyProviders.size){
    readyProviders.set("legacy",{info:{name:"Injected Wallet",rdns:"legacy"},provider:eip});
  }
  announceWallets();
  const check=document.getElementById("diagnose");
  check?.addEventListener("click",async()=>{
    const checks=[];
    checks.push("JavaScript: يعمل");
    checks.push("HTTPS: "+(location.protocol==="https:"?"نعم":"لا"));
    checks.push("Wallet provider: "+(readyProviders.size?"تم اكتشاف "+readyProviders.size:"غير موجود في المتصفح"));
    try{
      const response=await fetch("./alchemy-snapshot.json",{cache:"no-store"});
      if(!response.ok)throw Error("HTTP "+response.status);
      const data=await response.json();
      checks.push("Alchemy snapshot: "+(Array.isArray(data.networkBalances)?"تم التحميل":"غير صالح"));
    }catch(e){checks.push("Alchemy snapshot: تعذر التحميل ("+e.message+")");}
    checks.push("WalletConnect: غير مهيأ (Project ID مطلوب)");
    checks.push("Alchemy Account Kit: غير مهيأ (Smart Account configuration مطلوب)");
    checks.push("Web3Auth/MPC: غير مهيأ (ربط مزوّد الهوية وعوامل الاستعادة مطلوب)");
    checks.push("Gno.land: قراءة فقط — ليس EVM");
    document.getElementById("integrationChecks").textContent=checks.join("\n");
    status.textContent="اكتمل التشخيص بدون أي توقيع أو تحويل.";
  });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initIntegrations);
else initIntegrations();
