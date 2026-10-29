"use strict";
const express=require("express");
const crypto=require("node:crypto");
const app=express();
app.disable("x-powered-by");
const key=process.env.MOLLIE_TEST_API_KEY||"";
const testReady=process.env.HGW_SANDBOX_ONLY==="true"&&/^test_[A-Za-z0-9]+$/.test(key);
const origin=process.env.HGW_PUBLIC_ORIGIN||"";
const api="https://api.mollie.com/v2";
const products=Object.freeze({education:{minor:10000,label:"HGW Education demo"},food:{minor:12500,label:"HGW Food demo"},energy:{minor:15000,label:"HGW Energy demo"}});
const records=new Map(); // TEMPORARY test only; not durable or safe for production
app.use((req,res,next)=>{res.set("Cache-Control","no-store");res.set("X-Content-Type-Options","nosniff");next()});
app.use(express.json({limit:"10kb"}));
function fail(res,status,msg){return res.status(status).json({error:msg})}
function requireAdmin(req,res,next){const secret=process.env.HGW_SANDBOX_ACCESS_TOKEN||"";const supplied=req.get("X-HGW-Sandbox-Token")||"";if(secret.length<32||supplied.length!==secret.length||!crypto.timingSafeEqual(Buffer.from(secret),Buffer.from(supplied)))return fail(res,403,"Not authorised");next()}
async function mollie(path,options={}){const response=await fetch(api+path,{...options,headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json",...(options.headers||{})}});if(!response.ok)throw Error("Mollie API error "+response.status);return response.json()}
app.get("/health",(_req,res)=>res.json({provider:"mollie",mode:"test",configured:testReady&&/^https:\/\//.test(origin),livePayments:false,refundsEnabled:false}));
app.post("/checkout",requireAdmin,async(req,res)=>{
 if(!testReady||!/^https:\/\//.test(origin))return fail(res,503,"Mollie test account not configured");
 const item=String(req.body?.item||"");const product=products[item];if(!product)return fail(res,400,"Invalid item");
 const id="HGW-DEMO-"+crypto.randomUUID();
 const body={amount:{currency:"SEK",value:(product.minor/100).toFixed(2)},description:product.label+" "+id,redirectUrl:origin+"/checkout-sandbox.html?order="+encodeURIComponent(id),webhookUrl:origin+"/api/mollie/webhook",metadata:{orderId:id,kind:"demo"}};
 try{const payment=await mollie("/payments",{method:"POST",body:JSON.stringify(body)});if(payment.mode!=="test"||!payment.id?.startsWith("tr_")||!payment._links?.checkout?.href)return fail(res,502,"Unexpected test response");records.set(id,{paymentId:payment.id,item,status:"open"});return res.status(201).json({orderId:id,checkoutUrl:payment._links.checkout.href,mode:"test",paid:false})}catch(_){return fail(res,502,"Mollie test payment unavailable")}
});
app.post("/webhook",(_req,res)=>fail(res,503,"Webhook activation requires a durable, secure order ledger and reconciliation"));
app.post("/refund",(_req,res)=>fail(res,503,"Refunds disabled pending authenticated ledger approval"));
app.get("/orders/:id",requireAdmin,async(req,res)=>{
 const order=records.get(req.params.id);if(!order)return fail(res,404,"Unknown order");
 if(!testReady)return fail(res,503,"Mollie test account not configured");
 try{const p=await mollie("/payments/"+encodeURIComponent(order.paymentId));if(p.mode!=="test"||p.metadata?.orderId!==req.params.id)return fail(res,502,"Mismatched test payment");return res.json({orderId:req.params.id,status:p.status,paid:p.status==="paid",mode:"test"})}catch(_){return fail(res,502,"Unable to reconcile test payment")}
});
if(require.main===module)app.listen(Number(process.env.PORT||3000));
module.exports={app};
