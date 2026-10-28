"use strict";
const express=require("express");
const oidc=require("openid-client");
const crypto=require("node:crypto");

const app=express();
app.disable("x-powered-by");
app.set("trust proxy",false);
const PORT=Number(process.env.PORT||3000);
const issuer=process.env.SIGNICAT_ISSUER_URL;
const clientId=process.env.SIGNICAT_CLIENT_ID;
const clientSecret=process.env.SIGNICAT_CLIENT_SECRET;
const origin=process.env.PUBLIC_ORIGIN;
const callbackPath="/auth/signicat/callback";
const iduraIssuer=process.env.IDURA_ISSUER_URL;
const iduraClient=process.env.IDURA_CLIENT_ID;
const iduraSecret=process.env.IDURA_CLIENT_SECRET;
const iduraConfigured=[iduraIssuer,iduraClient,iduraSecret,origin].every(Boolean)&&/^https:\/\//.test(iduraIssuer||"");
let iduraConfigPromise;
async function iduraConfig(){if(!iduraConfigured)throw Error("Idura sandbox not configured");iduraConfigPromise??=oidc.discovery(new URL(iduraIssuer),iduraClient,iduraSecret);return iduraConfigPromise;}
const configured=[issuer,clientId,clientSecret,origin].every(Boolean)
  && /^https:\/\//.test(issuer||"") && /^https:\/\//.test(origin||"");
const pending=new Map(); // For sandbox only; use shared encrypted session store in production
const MAX_AGE=5*60*1000;
let configPromise;
async function config(){
 if(!configured)throw Error("Signicat sandbox configuration missing");
 configPromise??=oidc.discovery(new URL(issuer),clientId,clientSecret);
 return configPromise;
}
function safeError(res,status,message){return res.status(status).json({error:message})}
app.use((req,res,next)=>{
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 res.setHeader("Referrer-Policy","no-referrer");
 res.setHeader("Content-Security-Policy","default-src 'none'; frame-ancestors 'none'");
 next();
});
app.get("/auth/signicat/status",(req,res)=>res.json({mode:"sandbox",configured,connected:false,realVerification:false}));
app.get("/auth/signicat/start",async(req,res)=>{
 if(!configured)return safeError(res,503,"Signicat sandbox client not configured");
 try{
  const c=await config();
  const state=oidc.randomState(),nonce=oidc.randomNonce(),verifier=oidc.randomPKCECodeVerifier();
  const challenge=await oidc.calculatePKCECodeChallenge(verifier);
  const method=req.query.method;
  if(method && method!=="bankid" && method!=="default")return safeError(res,400,"Unsupported identity method");
  const parameters={redirect_uri:origin+callbackPath,scope:"openid",response_type:"code",state,nonce,code_challenge:challenge,code_challenge_method:"S256"};
  if(method==="bankid")parameters.acr_values="idp:sbid";
  const url=oidc.buildAuthorizationUrl(c,parameters);
  pending.set(state,{nonce,verifier,created:Date.now()});
  res.redirect(302,url.href);
 }catch(e){console.error("Signicat start failed",e.name);return safeError(res,502,"Identity provider unavailable")}
});
app.get(callbackPath,async(req,res)=>{
 const received=String(req.query.state||"");
 const entry=pending.get(received);
 if(!entry)return safeError(res,400,"Unknown or expired authentication request");
 pending.delete(received);
 if(Date.now()-entry.created>MAX_AGE)return safeError(res,400,"Authentication request expired");
 if(req.query.error)return safeError(res,401,"Authentication failed or cancelled");
 try{
  const c=await config();
  const url=new URL(req.originalUrl,origin);
  const tokens=await oidc.authorizationCodeGrant(c,url,{pkceCodeVerifier:entry.verifier,expectedState:received,expectedNonce:entry.nonce});
  const claims=tokens.claims();
  if(!claims?.sub)return safeError(res,401,"No verified subject returned");
  // Authentication event only. No persistent login session or KYC clearance is granted.
  return res.json({provider:"Signicat",environment:"sandbox",authentication:"authenticated-in-sandbox",kycApproved:false,subjectReference:crypto.createHash("sha256").update(claims.sub).digest("hex").slice(0,16),notice:"Do not use as legal KYC approval or production login"});
 }catch(e){console.error("Signicat callback failed",e.name);return safeError(res,401,"Unable to verify authentication response")}
});

app.get("/auth/idura/status",(_,res)=>res.json({mode:"sandbox",configured:iduraConfigured,connected:false,realVerification:false}));
app.get("/auth/idura/start",async(req,res)=>{
 if(!iduraConfigured)return safeError(res,503,"Idura sandbox client not configured");
 try{
  const c=await iduraConfig();const state=oidc.randomState(),nonce=oidc.randomNonce(),verifier=oidc.randomPKCECodeVerifier();
  const challenge=await oidc.calculatePKCECodeChallenge(verifier);
  const url=oidc.buildAuthorizationUrl(c,{redirect_uri:origin+"/auth/idura/callback",scope:"openid",response_type:"code",state,nonce,code_challenge:challenge,code_challenge_method:"S256"});
  pending.set("idura:"+state,{nonce,verifier,created:Date.now()});return res.redirect(302,url.href);
 }catch(e){console.error("Idura start failed",e.name);return safeError(res,502,"Identity provider unavailable")}
});
app.get("/auth/idura/callback",async(req,res)=>{
 const received=String(req.query.state||"");const key="idura:"+received;const entry=pending.get(key);
 if(!entry)return safeError(res,400,"Unknown or expired authentication request");pending.delete(key);
 if(Date.now()-entry.created>MAX_AGE)return safeError(res,400,"Authentication request expired");
 if(req.query.error)return safeError(res,401,"Authentication failed or cancelled");
 try{
  const c=await iduraConfig();const tokens=await oidc.authorizationCodeGrant(c,new URL(req.originalUrl,origin),{pkceCodeVerifier:entry.verifier,expectedState:received,expectedNonce:entry.nonce});
  const claims=tokens.claims();if(!claims?.sub)return safeError(res,401,"No verified subject returned");
  return res.json({provider:"Idura",environment:"sandbox",authentication:"authenticated-in-sandbox",kycApproved:false,subjectReference:crypto.createHash("sha256").update(claims.sub).digest("hex").slice(0,16)});
 }catch(e){console.error("Idura callback failed",e.name);return safeError(res,401,"Unable to verify authentication response")}
});
app.get("/",(_,res)=>res.json({application:"HGW Signicat integration",mode:"sandbox",message:"Visit /auth/signicat/start after configuring the Signicat sandbox client."}));
setInterval(()=>{for(const [state,v] of pending)if(Date.now()-v.created>MAX_AGE)pending.delete(state)},60000).unref();
if(require.main===module)app.listen(PORT,()=>console.log("HGW Signicat sandbox backend listening on",PORT));
module.exports={app};
