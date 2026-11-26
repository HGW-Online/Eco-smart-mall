import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePrivy, useWallets, toViemAccount } from '@privy-io/react-auth';
import { createSmartWalletClient, alchemyWalletTransport } from '@alchemy/wallet-apis';
import { baseSepolia } from 'viem/chains';
import { checkTransfer, fromWei } from './logic.js';
import { getBalance, getHistory } from './chain.js';

const EXPLORER = 'https://sepolia.basescan.org';
const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—');

export default function App({ config }) {
  const { ready, authenticated, login, logout, exportWallet } = usePrivy();
  const { wallets } = useWallets();
  // المحفظة المضمنة فقط، وليس أي محفظة خارجية متصلة بالمتصفح.
  const wallet = wallets.find((w) => w.walletClientType === 'privy');

  return (
    <main>
      <header>
        <h1>HGW Smart Wallet</h1>
        <span className="badge">شبكة تجريبية · Base Sepolia</span>
      </header>
      {!ready ? <p>جارٍ التحميل…</p>
        : !authenticated ? (
          <section>
            <p>ادخل ببريدك الإلكتروني. تُنشأ محفظتك عند أول دخول.</p>
            <button onClick={() => login()}>الدخول بالبريد</button>
          </section>
        ) : (
          <>
            {wallet
              ? <Wallet key={wallet.address} wallet={wallet} config={config}
                  onExport={() => exportWallet({ address: wallet.address })} />
              : <p>جارٍ تجهيز المحفظة…</p>}
            <button className="secondary" onClick={() => logout()}>تسجيل الخروج</button>
          </>
        )}
    </main>
  );
}

function Wallet({ wallet, config, onExport }) {
  const address = wallet.address;
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [review, setReview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [pendingId, setPendingId] = useState('');
  const sending = useRef(false);

  const refresh = useCallback(async () => {
    setLoadError('');
    const [b, h] = await Promise.allSettled([
      getBalance(config.apiKey, address), getHistory(config.apiKey, address),
    ]);
    setBalance(b.status === 'fulfilled' ? b.value : null);
    setHistory(h.status === 'fulfilled' ? h.value : null);
    if (b.status === 'rejected' || h.status === 'rejected') setLoadError('تعذر تحميل بعض البيانات. حاول التحديث.');
  }, [config.apiKey, address]);

  useEffect(() => { refresh(); }, [refresh]);

  function prepare(event) {
    event.preventDefault();
    setMessage(''); setTxHash('');
    try { setReview(checkTransfer({ to, amount, balance, self: address })); }
    catch (e) { setMessage(e.message); }
  }

  const makeClient = async () => createSmartWalletClient({
    signer: await toViemAccount({ wallet }),
    transport: alchemyWalletTransport({ apiKey: config.apiKey }),
    chain: baseSepolia,
    paymaster: { policyId: config.policyId },
  });

  // يتابع عملية أُرسلت. فشل المتابعة لا يعني فشل العملية، لذلك نمنع الإرسال المكرر.
  async function follow(client, id) {
    const result = await client.waitForCallsStatus({ id });
    if (result.status === 'success') {
      setTxHash(result.receipts?.[0]?.transactionHash ?? '');
      setMessage('تم الإرسال بنجاح');
      setTo(''); setAmount('');
    } else if (result.status === 'failure') {
      setMessage('فشلت العملية على الشبكة');
    } else {
      throw new Error('unconfirmed');
    }
    setPendingId('');
    await refresh();
  }

  async function run(task) {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    try { await task(); }
    finally { sending.current = false; setBusy(false); }
  }

  const send = () => run(async () => {
    let id = '';
    try {
      const client = await makeClient();
      setMessage('جارٍ الإرسال…');
      ({ id } = await client.sendCalls({ calls: [{ to: review.to, value: review.value }] }));
      setPendingId(id);
      setReview(null);
      setMessage('أُرسلت العملية، بانتظار التأكيد…');
      await follow(client, id);
    } catch (e) {
      console.error(e);
      setReview(null);
      setMessage(id
        ? 'لم يصل التأكيد بعد. لا تعد الإرسال؛ اضغط "تحقق من الحالة".'
        : 'لم يتأكد الإرسال. قد تكون سياسة الغاز بلغت حدها. حدّث الرصيد وراجع المستكشف قبل المحاولة مجدداً.');
    }
  });

  const recheck = () => run(async () => {
    try { await follow(await makeClient(), pendingId); }
    catch (e) { console.error(e); setMessage('ما زالت العملية غير مؤكدة. حاول لاحقاً.'); }
  });

  return (
    <>
      <section>
        <h2>محفظتك</h2>
        <code dir="ltr">{address}</code>
        <p className="balance" dir="ltr">{balance === null ? '—' : fromWei(balance)} ETH</p>
        <div className="row">
          <button onClick={() => navigator.clipboard.writeText(address)
            .then(() => setMessage('نُسخ العنوان'), () => setMessage('تعذر النسخ'))}>نسخ العنوان</button>
          <button className="secondary" onClick={refresh}>تحديث</button>
        </div>
        {loadError && <p role="alert">{loadError}</p>}
      </section>

      <section>
        <h2>إرسال ETH تجريبي</h2>
        <p className="hint">رسوم الغاز تغطيها سياسة الرعاية ضمن حدودها.</p>
        {review ? (
          <div>
            <p>راجع قبل التوقيع:</p>
            <p>المبلغ: <b dir="ltr">{fromWei(review.value)} ETH</b></p>
            <p>المستلم:</p><code dir="ltr">{review.to}</code>
            <div className="row">
              <button disabled={busy} onClick={send}>تأكيد وإرسال</button>
              <button className="secondary" disabled={busy} onClick={() => setReview(null)}>إلغاء</button>
            </div>
          </div>
        ) : (
          <form onSubmit={prepare}>
            <label>عنوان المستلم<input dir="ltr" value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x…" /></label>
            <label>المبلغ<input dir="ltr" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.001" /></label>
            <button disabled={busy || Boolean(pendingId)}>مراجعة</button>
          </form>
        )}
        <p role="status">{message}</p>
        {pendingId && !busy && <button onClick={recheck}>تحقق من الحالة</button>}
        {txHash && <a href={`${EXPLORER}/tx/${txHash}`} target="_blank" rel="noreferrer">عرض العملية في المستكشف</a>}
      </section>

      <section>
        <h2>آخر التحويلات</h2>
        {history === null ? <p>—</p> : history.length === 0 ? <p>لا توجد تحويلات ظاهرة.</p> : (
          <ul>
            {history.map((t) => (
              <li key={t.uniqueId}>
                <a href={`${EXPLORER}/tx/${t.hash}`} target="_blank" rel="noreferrer">
                  {t.direction === 'in' ? 'وارد من' : 'صادر إلى'} <bdi>{short(t.direction === 'in' ? t.from : t.to)}</bdi>
                </a>
                <bdi dir="ltr">{t.value ?? '—'} {t.asset ?? ''}</bdi>
              </li>
            ))}
          </ul>
        )}
        <p className="hint">قد لا تظهر هنا تحويلات ETH الصادرة من الحساب الذكي لأنها داخلية. راجع <a href={`${EXPLORER}/address/${address}`} target="_blank" rel="noreferrer">المستكشف</a>.</p>
      </section>

      <section>
        <h2>ملكية المحفظة</h2>
        <p className="hint">يمكنك تصدير المفتاح الخاص عبر نافذة Privy. لا تشاركه مع أي أحد.</p>
        <button className="secondary" onClick={onExport}>تصدير المفتاح</button>
      </section>
    </>
  );
}
