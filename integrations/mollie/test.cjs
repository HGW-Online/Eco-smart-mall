"use strict";const test=require("node:test");const assert=require("node:assert/strict");const{app}=require("./server.cjs");
async function request(path,method="GET",body){const server=app.listen(0);try{const response=await fetch("http://127.0.0.1:"+server.address().port+path,{method,headers:{"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});return{code:response.status,data:await response.json()}}finally{server.close()}}
test("health never advertises live payment",async()=>{const x=await request("/health");assert.equal(x.code,200);assert.equal(x.data.livePayments,false);assert.equal(x.data.refundsEnabled,false)});
test("unauthorised test checkout refused",async()=>{const x=await request("/checkout","POST",{item:"food"});assert.equal(x.code,403)});
test("forged webhook cannot set paid",async()=>{const x=await request("/webhook","POST",{id:"tr_fake"});assert.equal(x.code,503)});
test("refund disabled",async()=>{const x=await request("/refund","POST",{});assert.equal(x.code,503)});
test("unknown order cannot be settled",async()=>{const x=await request("/orders/fake");assert.equal(x.code,403)});
