"use strict";const test=require("node:test");const assert=require("node:assert/strict");const {app}=require("./server.cjs");
async function call(path,body){const server=app.listen(0);try{const res=await fetch("http://127.0.0.1:"+server.address().port+path,{method:body?"POST":"GET",headers:{"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});return{status:res.status,data:await res.json()}}finally{server.close()}}
test("health cannot claim real payment",async()=>{const r=await call("/health");assert.equal(r.data.livePayments,false)});
test("Stripe test checkout fails closed without test credentials",async()=>{const r=await call("/checkout/stripe",{item:"food"});assert.equal(r.status,503)});
test("Adyen test checkout fails closed without credentials",async()=>{const r=await call("/checkout/adyen",{item:"food"});assert.equal(r.status,503)});
test("Stripe test refunds fail closed without credentials",async()=>{const r=await call("/refunds/stripe",{paymentIntentId:"pi_fake"});assert.equal(r.status,503)});
test("Adyen refunds remain disabled",async()=>{const r=await call("/refunds/adyen",{});assert.equal(r.status,503)});
test("Webhook endpoints fail closed",async()=>{for(const p of ["/webhooks/stripe","/webhooks/adyen"]){const r=await call(p,{});assert.equal(r.status,503)}});
