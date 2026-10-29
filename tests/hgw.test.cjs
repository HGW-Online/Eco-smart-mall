'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {landed,finance}=require('../site/hgw.js');
const example={price:1000,inspection:50,freight:150,insurance:25,storage:20,clearance:40,delivery:30,service:50,dutyRate:10,vatRate:14,reference:3000};
test('landed price includes customs, tax and all service charges',()=>{const r=landed(example);assert.equal(r.duty,117.5);assert.equal(r.vat,180.95);assert.equal(r.total,1663.45);assert.ok(Math.abs(r.saving-44.55166666666667)<1e-8);});
test('savings are not forced into the 50–80% target',()=>{assert.ok(landed({...example,reference:1000}).saving<0);assert.equal(landed({...example,reference:0}).saving,null);});
test('invalid cost assumptions fail rather than create false savings',()=>{for(const price of [-1,NaN,Infinity])assert.throws(()=>landed({...example,price}));assert.throws(()=>landed({...example,vatRate:101}));});
test('financial model separates gross merchandise value from HGW revenue',()=>{const r=finance({orders:10000,average:15000,take:4,fee:400,margin:30,fixed:2000000,allocation:10000000});assert.equal(r.gmv,150000000);assert.equal(r.revenue,10000000);assert.equal(r.operating,1000000);assert.equal(r.breakeven,6667);assert.equal(r.remaining,290000000);});
test('zero contribution has no break-even and budget cannot exceed envelope',()=>{assert.equal(finance({orders:0,average:15000,take:4,fee:400,margin:30,fixed:2000000,allocation:0}).breakeven,null);assert.throws(()=>finance({orders:1,average:1,take:4,fee:4,margin:30,fixed:2,allocation:300000001}));});
test('manifest supports subdirectory hosting and shell resources exist',()=>{const site=path.join(__dirname,'../site');const m=JSON.parse(fs.readFileSync(path.join(site,'manifest.webmanifest')));assert.equal(m.start_url,'./');assert.equal(m.scope,'./');for(const icon of m.icons)assert.ok(fs.existsSync(path.join(site,icon.src)));const sw=fs.readFileSync(path.join(site,'sw.js'),'utf8');const shell=sw.match(/const SHELL=(\[[^;]+\])/)[1].replaceAll("'",'"');for(const item of JSON.parse(shell))assert.ok(fs.existsSync(path.join(site,item)));});
test('all sector screens render in both languages without a browser',()=>{
 const vm=require('node:vm');const doc={addEventListener(){}};const sandbox={document:doc,Intl,console};sandbox.window={document:doc};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../site/hgw.js'),'utf8'),sandbox);
 for(const lang of ['ar','en'])for(const page of ['insurance','circular','logistics','cyber','research','quality','communications','cognitive','devices']){const rendered=sandbox.window.HGW.render(page,lang);assert.match(rendered,/<h1>/);assert.doesNotMatch(rendered,/undefined/);}
 assert.match(sandbox.window.HGW.render('cyber','ar'),/cybersecurity-plan.html/);
});
test('quality simulation measures units, does not silently certify safety, and rejects impossible counts',()=>{
 const {qualityMetric}=require('../site/hgw.js');
 assert.deepEqual(qualityMetric({inspected:1000,defective:20,target:1}),{rate:2,conformance:98,withinTarget:false});
 assert.equal(qualityMetric({inspected:100,defective:1,target:1}).withinTarget,true);
 for(const v of [{inspected:0,defective:0,target:1},{inspected:10,defective:11,target:1},{inspected:10,defective:1.5,target:1},{inspected:10,defective:1,target:101}])assert.throws(()=>qualityMetric(v));
});
test('Universal Mind allocation reconciles to the requested envelope without claiming funding',()=>{
 const p=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/HGW-UNIVERSAL-MIND-ALLOCATION.json'),'utf8'));
 assert.equal(p.items.reduce((sum,item)=>sum+item.amount,0),22000000);
 assert.equal(p.sector_request,22000000);
 assert.equal(p.programme_envelope_scenario-p.sector_request,p.unallocated_before_other_sector_requests);
 assert.equal(p.status,'proposed_unfunded_allocation');
 assert.equal(p.other_sector_allocations_reconciled,false);
 assert.equal(p.shared_cost_deductions_confirmed,false);
});
test('integrated app navigation renders every sector and language',()=>{
 const vm=require('node:vm');const elements=new Map();const listeners={};
 const element=id=>{if(!elements.has(id))elements.set(id,{id,textContent:'',innerHTML:'',addEventListener(){},classList:{contains(){return true;},add(){},remove(){}}});return elements.get(id);};
 const document={documentElement:{},getElementById:element,querySelector:()=>element('demo'),addEventListener(type,fn){(listeners[type]??=[]).push(fn);}};
 const window={document,scrollTo(){}};const ctx={window,document,Intl,console,localStorage:{getItem(){return null;},setItem(){}},setTimeout};
 for(const file of ['hgw.js','app.js']){vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../site',file),'utf8'),ctx);if(file==='hgw.js')ctx.HGW=window.HGW;}
 const click=button=>{for(const fn of listeners.click||[])fn({target:{closest:()=>button}});};
 for(let language=0;language<2;language++){
  for(const page of ['home','insurance','circular','logistics','cyber','research','quality','communications','cognitive','devices']){
   click({dataset:{page}});assert.match(element('view').innerHTML,/<h1>/);assert.doesNotMatch(element('view').innerHTML,/undefined/);
  }
  click({id:'lang',dataset:{}});
 }
});
