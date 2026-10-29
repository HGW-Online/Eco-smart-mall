'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const {massBalance}=require('../site/abundance.js');
const sample={input:1000,reused:200,recycled:600,stock:100,disposed:80,energy:500,output:100};
test('mass balance separates actual recovery, inventory, known losses and unexplained mass',()=>{assert.deepEqual(massBalance(sample),{accounted:980,unaccounted:20,circularity:80,energyPerUnit:5});});
test('unprocessed inventory does not count as completed circular recovery',()=>{assert.equal(massBalance({...sample,reused:0,recycled:0,stock:1000,disposed:0}).circularity,0);});
test('mass balance rejects double counted mass and invalid units/counts',()=>{for(const v of [{...sample,recycled:1600},{...sample,input:0},{...sample,energy:-1},{...sample,output:0},{...sample,stock:NaN}])assert.throws(()=>massBalance(v));});
