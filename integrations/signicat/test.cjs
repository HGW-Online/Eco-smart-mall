"use strict";const {test}=require("node:test");const assert=require("node:assert/strict");const http=require("node:http");const {app}=require("./server.cjs");
async function request(url){const server=app.listen(0);try{const port=server.address().port;return await fetch("http://127.0.0.1:"+port+url,{redirect:"manual"})}finally{server.close()}}
test("signicat not configured is closed to actual login",async()=>{const r=await request("/auth/signicat/start?method=bankid");assert.equal(r.status,503)});
test("idura not configured is closed to actual login",async()=>{const r=await request("/auth/idura/start");assert.equal(r.status,503)});
test("callback without validated state cannot authenticate",async()=>{for(const p of ["/auth/signicat/callback?code=fake&state=fake","/auth/idura/callback?code=fake&state=fake"]){const r=await request(p);assert.equal(r.status,400)}});
test("status does not overstate verification",async()=>{for(const p of ["/auth/signicat/status","/auth/idura/status"]){const r=await request(p);const data=await r.json();assert.equal(data.realVerification,false);assert.equal(data.connected,false)}});
