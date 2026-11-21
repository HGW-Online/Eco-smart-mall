/**
 * HGW Universal Wallet — Gno.land watch-only adapter.
 * No private-key or social-login recovery is performed here.
 * Uses official gnoland-1 RPC; balances/vesting must be read separately.
 */
export const GNO_LAND = Object.freeze({
  id: "gnoland-1",
  name: "Gno.land Mainnet",
  family: "gno",
  currency: "GNOT",
  rpc: "https://rpc.gno.land:443",
  explorer: "https://gnoscan.io",
  addressPrefix: "g1",
  evmCompatible: false,
  walletConnectEvmCompatible: false,
  readOnly: true,
  supportsSigning: false,
  supportsMpcRecovery: false,
  warning: "Mainnet GNOT transfers may be restricted under the Gno.land Constitution; check official rules."
});

export function isGnoAddress(value) {
  return typeof value === "string" && /^g1[023456789acdefghjklmnpqrstuvwxyz]{38}$/.test(value);
}

export async function getGnoAccount(address, rpc = GNO_LAND.rpc, fetcher = fetch) {
  if (!isGnoAddress(address)) throw new Error("Invalid Gno.land g1 account address");
  if (rpc !== GNO_LAND.rpc) throw new Error("Only the reviewed Gno.land RPC is allowed");
  const endpoint = new URL(rpc + "/abci_query");
  endpoint.searchParams.set("path", JSON.stringify("auth/accounts/" + address));
  const response = await fetcher(endpoint.toString(), { method: "GET", cache: "no-store" });
  if (!response.ok) throw new Error("Gno.land RPC HTTP error " + response.status);
  const data = await response.json();
  if (data.error || data.result?.response?.ResponseBase?.Error) throw new Error("Gno.land RPC query rejected");
  const encoded = data.result?.response?.ResponseBase?.Data;
  if (!encoded) return { address, found: false, account: null, verifiedBalance: false };
  // Latin1 representation is sufficient for Amino JSON payload and avoids saving keys.
  const raw = atob(encoded);
  const bytes = Uint8Array.from(raw, ch => ch.charCodeAt(0));
  const decoded = new TextDecoder("utf-8").decode(bytes);
  const account = JSON.parse(decoded);
  return { address, found: true, account, verifiedBalance: false };
}

export function explorerLink(address) {
  if (!isGnoAddress(address)) throw new Error("Invalid Gno.land address");
  return GNO_LAND.explorer + "/address/" + encodeURIComponent(address);
}

/** Read current native bank balance (ugnot) from Gno.land RPC without wallet keys.
 * Results do not include locked vesting allocations or proof of account ownership.
 */
export async function getGnoBalances(address, fetcher=fetch){
  if(!isGnoAddress(address))throw Error("Invalid Gno.land account address");
  const url=new URL(GNO_LAND.rpc+"/abci_query");
  url.searchParams.set("path",JSON.stringify("bank/balances/"+address));
  const res=await fetcher(url.toString(),{method:"GET",cache:"no-store"});
  if(!res.ok)throw Error("RPC HTTP "+res.status);
  const doc=await res.json();
  if(doc.error)throw Error(doc.error.message||"RPC error");
  const r=doc.result?.response?.ResponseBase;
  if(!r)throw Error("Missing Gno.land ResponseBase");
  if(r.Error)throw Error(typeof r.Error==="string"?r.Error:JSON.stringify(r.Error));
  if(!r.Data)return {address,raw:"",balanceGNOT:null,unavailable:true};
  const bytes=Uint8Array.from(atob(r.Data),ch=>ch.charCodeAt(0));
  const decoded=new TextDecoder().decode(bytes);
  const match=decoded.match(/(\d+)ugnot/);
  const native=match?((BigInt(match[1])/1000000n).toString()+"."+((BigInt(match[1])%1000000n).toString().padStart(6,"0"))):null;
  return {address,raw:decoded,balanceGNOT:native,unavailable:false};
}
