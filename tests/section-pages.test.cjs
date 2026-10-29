'use strict';const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const site=path.resolve(__dirname,'../site');const config=require('../site/section-routes.json');
test('all section URLs are distinct real documents with matching entry route and current asset version',()=>{
 assert.equal(config.routes.length,52);assert.equal(new Set(config.routes).size,config.routes.length);
 for(const route of config.routes){const html=fs.readFileSync(path.join(site,route+'.html'),'utf8');assert.ok(html.includes('data-section="'+route+'"'));assert.ok(html.includes('Release '+config.release));for(const asset of ['app.js','pwa.js','styles.css'])assert.ok(html.includes(asset+'?v='+config.release));}
});
test('direct section URL starts on that section and navigation opens another document',()=>{
 const nodes=new Map(),events={};const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',addEventListener(){},classList:{contains(){return true;}}});return nodes.get(id);};
 const document={body:{dataset:{section:'insurance'}},documentElement:{},getElementById:node,querySelector:()=>node('demo'),addEventListener(type,fn){(events[type]??=[]).push(fn);}};
 let destination;const window={document,location:{assign(url){destination=url;}},scrollTo(){}};const ctx={window,document,Intl,console,localStorage:{getItem(){return null;},setItem(){}}};
 for(const file of ['resources-data.js','resources.js','abundance.js','recovery.js','encyclopedia.js','hgw.js','app.js']){vm.runInNewContext(fs.readFileSync(path.join(site,file),'utf8'),ctx);for(const key of ['HGWResources','HGWAbundance','HGWRecovery','HGWEncyclopedia','HGW'])if(window[key])ctx[key]=window[key];}
 assert.match(node('view').innerHTML,/HGW GLOBAL INSURANCE/);assert.doesNotMatch(node('view').innerHTML,/hgw-resource-fair/);
 for(const fn of events.click)fn({target:{closest:()=>({dataset:{page:'bank-time'}})}});
 assert.equal(destination,'./bank-time.html?v='+config.release);
});
test('service worker upgrades and revalidates public content without clearing customer storage',()=>{
 const sw=fs.readFileSync(path.join(site,'sw.js'),'utf8'),pwa=fs.readFileSync(path.join(site,'pwa.js'),'utf8');assert.match(sw,/skipWaiting/);assert.match(sw,/cache:'no-cache'/);assert.match(pwa,/updateViaCache:'none'/);assert.match(pwa,/controllerchange/);assert.doesNotMatch(pwa,/localStorage\.clear/);
});
