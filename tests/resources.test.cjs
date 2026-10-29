'use strict';
const test=require('node:test');const assert=require('node:assert/strict');
const data=require('../site/resources-data.js');const {fairEstimate}=require('../site/resources.js');
test('resource references preserve source, period, units and category rather than claim current quotes',()=>{
 assert.equal(data.prices.length,17);assert.equal(data.observation_period,'2026-09');assert.match(data.source_url,/thedocs\.worldbank\.org/);assert.equal(data.categories.length,15);
 const ids=new Set(data.categories.map(c=>c.id));for(const p of data.prices){assert.ok(ids.has(p.category));assert.ok(p.value>0);assert.match(p.unit,/^USD\//);assert.ok(p.basis);}
 assert.equal(data.prices.find(p=>p.id==='copper').value,14474);
});
test('fair-price comparison uses median of comparable quotes and charges excluded services once',()=>{
 assert.deepEqual(fairEstimate({quotes:[110,100,105],quantity:2,adjustment:10,costs:5}),{median:105,unit:120.50000000000001,total:241.00000000000003,count:3,low:100,high:110});
 assert.equal(fairEstimate({quotes:[100,110,120,1000],quantity:1,adjustment:0,costs:0}).median,115);
});
test('comparison rejects sparse, invalid and impossible assumptions',()=>{
 const base={quotes:[100,105,110],quantity:1,adjustment:0,costs:0};
 for(const patch of [{quotes:[100,110]},{quotes:[0,100,110]},{quotes:[NaN,100,110]},{quantity:0},{quantity:Infinity},{adjustment:-100},{adjustment:101},{costs:-1}])assert.throws(()=>fairEstimate({...base,...patch}));
});
