'use strict';
let hgwInstallPrompt;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();hgwInstallPrompt=event;});
window.addEventListener('appinstalled',()=>{hgwInstallPrompt=null;});
document.addEventListener('click',async event=>{
  if(!event.target.closest('#hgw-install'))return;
  const status=document.getElementById('hgw-install-status');
  const ar=document.documentElement.lang==='ar';
  if(hgwInstallPrompt){const prompt=hgwInstallPrompt;hgwInstallPrompt=null;await prompt.prompt();const result=await prompt.userChoice;status.textContent=result.outcome==='accepted'?(ar?'تم قبول طلب التثبيت.':'Installation accepted.'):(ar?'لم يتم التثبيت؛ يمكنك المحاولة من قائمة المتصفح.':'Installation dismissed; try the browser menu.');}
  else status.textContent=ar?'استخدم تعليمات نظامك أدناه. قد يكون التطبيق مثبتًا بالفعل أو المتصفح لا يعرض تثبيتًا مباشرًا.':'Use the instructions below. The app may already be installed or this browser may not offer direct installation.';
});
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  let hgwReloading=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!hgwReloading){hgwReloading=true;location.reload();}});
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(registration=>registration.update()).catch(()=>{/* Online use remains available. */}));
}
