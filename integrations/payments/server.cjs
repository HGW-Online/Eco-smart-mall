"use strict";
const express=require("express");const crypto=require("node:crypto");const Stripe=require("stripe");const app=express();app.disable("x-powered-by");
const origin=process.env.PUBLIC_ORIGIN||"";
const stripeKey=process.env.STRIPE_SECRET_KEY||"";
const adyenKey=process.env.ADYEN_API_KEY||"";
const adyenMerchant=process.env.ADYEN_MERCHANT_ACCOUNT||"";
const adyenBase=process.env.ADYEN_CHECKOUT_BASE_URL||"https://checkout-test.adyen.com/v71";
const isStripeTest=stripeKey.startsWith("sk_test_");
const isAdyenTest=adyenKey.length>0 && adyenMerchant.length>0 && /^https:\/\/checkout-test\.adyen\.com\//.test(adyenBase);
const enabled=process.env.HGW_SANDBOX_ONLY==="true";
const stripe=isStripeTest&&enabled?new Stripe(stripeKey):null;
const amounts=Object.freeze({education:10000,food:12500,energy:15000}); // SEK öre, controlled server catalogue
app.use((req,res,next)=>{res.setHeader("Cache-Control","no-store");res.setHeader("X-Content-Type-Options","nosniff");next()});
app.get("/health",(_,res)=>res.json({sandbox:true,stripeConfigured:!!stripe,adyenConfigured:isAdyenTest&&enabled,livePayments:false}));
app.use(express.json({limit:"10kb"}));
app.use(["/checkout","/refunds","/webhooks"],(req,res,next)=>{const secret=process.env.HGW_SANDBOX_ACCESS_TOKEN||"";const provided=req.get("X-HGW-Sandbox-Token")||"";if(secret.length<32||provided.length!==secret.length||!crypto.timingSafeEqual(Buffer.from(provided),Buffer.from(secret)))return res.status(403).json({error:"Sandbox access denied"});next()});
function error(res,code,msg){return res.status(code).json({error:msg})}
function validateOrder(req,res){const item=req.body?.item;if(typeof item!=="string"||!Object.hasOwn(amounts,item)){error(res,400,"Unknown demo item");return null}return{item,amount:amounts[item]}}
app.post("/checkout/stripe",async(req,res)=>{
 if(!stripe)return error(res,503,"Stripe sandbox account not connected");
 const order=validateOrder(req,res);if(!order)return;
 try{const session=await stripe.checkout.sessions.create({mode:"payment",payment_method_types:["card"],line_items:[{price_data:{currency:"sek",unit_amount:order.amount,product_data:{name:"HGW test "+order.item}},quantity:1}],success_url:origin+"/checkout-sandbox.html?payment=return",cancel_url:origin+"/checkout-sandbox.html?payment=cancel",metadata:{demo:"true",item:order.item}});return res.json({url:session.url,mode:"test",paid:false})}catch(e){return error(res,502,"Stripe sandbox unavailable")}
});
app.post("/checkout/adyen",async(req,res)=>{
 if(!isAdyenTest||!enabled)return error(res,503,"Adyen test merchant not connected");
 const order=validateOrder(req,res);if(!order)return;
 try{const response=await fetch(adyenBase+"/paymentLinks",{method:"POST",headers:{"Content-Type":"application/json","X-API-Key":adyenKey,"Idempotency-Key":crypto.randomUUID()},body:JSON.stringify({merchantAccount:adyenMerchant,reference:"HGW-TEST-"+crypto.randomUUID(),amount:{currency:"SEK",value:order.amount},returnUrl:origin+"/checkout-sandbox.html?payment=return",countryCode:"SE"})});if(!response.ok)return error(res,502,"Adyen test checkout unavailable");const result=await response.json();return res.json({url:result.url,mode:"test",paid:false})}catch(e){return error(res,502,"Adyen sandbox unavailable")}
});
app.post("/refunds/stripe",(_req,res)=>error(res,503,"Refund execution disabled pending authenticated admin and verified ledger"));
app.post("/refunds/adyen",(_req,res)=>error(res,503,"Adyen refunds are disabled until signed webhook and verified reference ledger are implemented"));
app.post("/webhooks/stripe",(_req,res)=>error(res,503,"Stripe webhook processing is disabled pending raw-body signature validation and durable ledger"));
app.post("/webhooks/adyen",(_req,res)=>error(res,503,"Adyen webhook processing is disabled pending HMAC validation and durable ledger"));
if(require.main===module)app.listen(process.env.PORT||3000);
module.exports={app};
