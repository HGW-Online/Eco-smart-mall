'use strict';
const CACHE='hgw-shell-v14';
const SHELL=['./','./index.html','./styles.css','./app.js','./hgw.js','./resources.js','./resources-data.js','./abundance.js','./abundance-plan.html','./recovery.js','./recovery-plan.html','./encyclopedia.js','./encyclopedia-plan.html','./pwa.js','./manifest.webmanifest','./cybersecurity-plan.html','./research-plan.html','./research-proposal.html','./quality-plan.html','./quality-proposal.html','./communications-plan.html','./communications-proposal.html','./cognitive-proposal.html','./cognitive-plan.html','./universal-mind-proposal.html','./icons/app-192.png','./icons/app-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('hgw-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  // Cache only the public app shell, never customer/API/payment responses.
  if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  const isPage=event.request.mode==='navigate';
  const isShell=SHELL.some(path=>new URL(path,self.registration.scope).pathname===url.pathname);
  if(!isPage&&!isShell)return;
  event.respondWith(fetch(event.request,{cache:'no-cache'}).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
    return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached||Response.error())));
});
