// Run: node --test tests/unified-assets.test.cjs
// No npm dependencies or browser/payment calls.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('demo/unified-assets.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(script,'expected standalone inline demo script');
function boot(){
  const sandbox={console,structuredClone,Number,Math,Set,Object,Array};
  const dom=new Map();
  function el(id){if(!dom.has(id))dom.set(id,{value:'',textContent:'',innerHTML:'',classList:{toggle(){}},options:[],style:{}});return dom.get(id)}
  sandbox.document={documentElement:{},getElementById:el,querySelectorAll:()=>[]};
  vm.createContext(sandbox);
  vm.runInContext(script[1],sandbox);
  return sandbox;
}
test('initial portfolio valuation and rights separation',()=>{
 const s=boot();
 assert.equal(vm.runInContext('totalValue()',s),5700);
 assert.equal(vm.runInContext('rights.U[0]===1 && rights.U[2]===0 && rights.G[1]===1 && rights.E[2]===1',s),true);
});
test('transfer preserves value and global quantity',()=>{
 const s=boot();
 const before=vm.runInContext('holdings.filter(h=>h.kind==="U").reduce((v,h)=>v+h.qty,0)',s);
 const result=vm.runInContext('transfer("u-arb","Solana",10)',s);
 assert.equal(result.ok,true);
 assert.equal(vm.runInContext('totalValue()',s),5700);
 assert.equal(vm.runInContext('holdings.filter(h=>h.kind==="U").reduce((v,h)=>v+h.qty,0)',s),before);
 assert.equal(vm.runInContext('holdings.find(x=>x.id==="u-arb").qty',s),1240);
 assert.equal(vm.runInContext('holdings.find(x=>x.id==="u-sol").qty',s),260);
});
test('invalid and nonutility transfers cannot alter state',()=>{
 const s=boot();
 for(const expression of ['transfer("eq","Solana",1)','transfer("u-arb","Arbitrum",1)','transfer("u-arb","Solana",-1)','transfer("u-arb","Solana",99999)','transfer("u-arb","Solana",NaN)']){
  assert.equal(vm.runInContext(expression+'.ok',s),false,expression);
 }
 assert.equal(vm.runInContext('totalValue()',s),5700);
});
