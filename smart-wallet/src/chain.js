// قراءة البيانات عبر Alchemy على Base Sepolia.
export async function rpc(apiKey, method, params) {
  const res = await fetch(`https://base-sepolia.g.alchemy.com/v2/${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.error) throw new Error('تعذر الاتصال بـ Alchemy');
  return body.result;
}

export const getBalance = async (key, address) =>
  BigInt(await rpc(key, 'eth_getBalance', [address, 'latest']));

// فئة internal غير مطلوبة هنا لأنها غير متاحة على كل الشبكات.
export async function getHistory(key, address) {
  const query = (side) =>
    rpc(key, 'alchemy_getAssetTransfers', [{
      [side]: address, category: ['external', 'erc20'], order: 'desc', maxCount: '0xa', withMetadata: true,
    }]);
  const [sent, received] = await Promise.all([query('fromAddress'), query('toAddress')]);
  return [
    ...sent.transfers.map((t) => ({ ...t, direction: 'out' })),
    ...received.transfers.map((t) => ({ ...t, direction: 'in' })),
  ].sort((a, b) => Number(BigInt(b.blockNum) - BigInt(a.blockNum))).slice(0, 10);
}
