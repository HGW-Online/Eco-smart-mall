// HGW WalletConnect bridge — isolated connection-only proof of concept.
// Reown AppKit CDN usage based on the official reown-com/appkit html-wagmi-cdn example.
// No personal_sign, eth_sendTransaction or approval requests are implemented.
const projectId="48637b04d2fb391e056bbfde1195d092";
const $=id=>document.getElementById(id);
const status=msg=>{$("wcStatus").textContent=msg};
let appkit;
async function launch(){
  $("wcStart").disabled=true;
  status("جاري تحميل Reown AppKit من التوزيعة الرسمية...");
  try{
    const {WagmiAdapter,createAppKit,networks}=await import("https://cdn.jsdelivr.net/npm/@reown/appkit-cdn@1.8.24/dist/appkit.js");
    const list=[networks.mainnet,networks.base,networks.gnosis,networks.celo,networks.polygon,networks.arbitrum].filter(Boolean);
    if(!list.length)throw Error("No supported networks from SDK");
    const adapter=new WagmiAdapter({networks:list,projectId});
    appkit=createAppKit({
      adapters:[adapter],networks:list,projectId,themeMode:"dark",
      metadata:{name:"HGW Universal Wallet",description:"Watch-only wallet connection demo",url:"https://hgw-online.github.io/Eco-smart-mall/",icons:[]}
    });
    appkit.subscribeAccount(s=>{
      if(s.address&&/^0x[a-fA-F0-9]{40}$/.test(s.address)){
        $("wcAccount").textContent=s.address;
        status("تم ربط عنوان EVM. لا توجد صلاحية توقيع أو إرسال في هذه الصفحة.");
        $("wcCopy").disabled=false;
      }else{
        $("wcAccount").textContent="لم يتم ربط أي حساب";
        $("wcCopy").disabled=true;
      }
    });
    $("wcModal").disabled=false;
    $("wcDisconnect").disabled=false;
    status("تم تحميل واجهة الاتصال. اضغط «فتح خيارات المحافظ».");
    await appkit.open();
  }catch(e){status("تعذر تشغيل WalletConnect: "+(e?.message||String(e))+" — قد يلزم السماح بالنطاق في Reown Dashboard أو تحديث SDK.");}
  finally{$("wcStart").disabled=false;}
}
$("wcStart").addEventListener("click",launch);
$("wcModal").addEventListener("click",()=>appkit?.open());
$("wcDisconnect").addEventListener("click",()=>appkit?.disconnect());
$("wcCopy").addEventListener("click",()=>navigator.clipboard.writeText($("wcAccount").textContent).then(()=>status("تم نسخ عنوان الحساب")).catch(()=>status("تعذر النسخ")));
