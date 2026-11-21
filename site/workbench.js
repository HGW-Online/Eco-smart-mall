'use strict';

const byId = (id) => document.getElementById(id);
const addressPattern = /^0x[0-9a-f]{40}$/i;
const transactionPattern = /^0x[0-9a-f]{64}$/i;
const explorers = {
  celo: 'https://celo-sepolia.blockscout.com',
  gnosis: 'https://gnosis.blockscout.com',
};

byId('lookup').addEventListener('click', () => {
  const value = byId('identifier').value.trim();
  const type = addressPattern.test(value) ? 'address' : transactionPattern.test(value) ? 'tx' : '';
  const link = byId('result');
  link.hidden = !type;
  if (!type) {
    link.removeAttribute('href');
    byId('explorer-status').textContent = 'أدخل عنوان EVM أو رقم معاملة بصيغة صحيحة.';
    return;
  }
  link.href = new URL('/' + type + '/' + value, explorers[byId('network').value]);
  byId('explorer-status').textContent = 'افتح المستكشف للاطلاع على بيانات الشبكة العامة.';
});

byId('wallet').addEventListener('click', async () => {
  const status = byId('wallet-status');
  if (!window.ethereum?.request) {
    status.textContent = 'افتح الصفحة داخل متصفح يدعم محفظة EVM.';
    return;
  }
  try {
    const [accounts, chain] = await Promise.all([
      window.ethereum.request({ method: 'eth_accounts' }),
      window.ethereum.request({ method: 'eth_chainId' }),
    ]);
    const address = accounts.find((account) => addressPattern.test(account));
    if (!address) {
      status.textContent = 'اسمح للموقع بقراءة عنوان المحفظة من إعدادات محفظتك ثم أعد المحاولة.';
      return;
    }
    byId('result').hidden = true;
    if (chain !== '0xaa044c' && chain !== '0x64') {
      status.textContent = address + ' · شبكة خارج نطاق المستكشف · Chain ID ' + String(chain);
      return;
    }
    byId('identifier').value = address;
    if (chain === '0xaa044c') byId('network').value = 'celo';
    if (chain === '0x64') byId('network').value = 'gnosis';
    status.textContent = address + ' · Chain ID ' + String(chain);
  } catch {
    status.textContent = 'تعذرت قراءة المحفظة.';
  }
});

const encoder = new TextEncoder();
const encode = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const decode = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

async function deriveKey(passphrase, salt, usage) {
  const material = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600000 },
    material, { name: 'AES-GCM', length: 256 }, false, [usage],
  );
}

function protect(buttonId, action) {
  const button = byId(buttonId);
  button.addEventListener('click', async () => {
    const status = byId('crypto-status');
    const field = byId('passphrase');
    if (!globalThis.crypto?.subtle) {
      status.textContent = 'التشفير يتطلب سياقًا آمنًا مثل HTTPS.';
      return;
    }
    if (field.value.length < 12) {
      status.textContent = 'أدخل عبارة مرور من 12 حرفًا على الأقل.';
      return;
    }
    button.disabled = true;
    try {
      status.textContent = await action(field.value);
      field.value = '';
    } catch {
      status.textContent = 'تعذرت العملية. تحقق من الملف وعبارة المرور.';
    } finally {
      button.disabled = false;
    }
  });
}

protect('export', async (passphrase) => {
  const note = byId('note').value;
  if (!note.trim()) return 'أدخل ملاحظات أولًا.';
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, 'encrypt');
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(note));
  const payload = JSON.stringify({ version: 1, salt: encode(salt), iv: encode(iv), data: encode(data) });
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const download = document.createElement('a');
  download.href = url;
  download.download = 'hgw-encrypted-notes.json';
  download.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'تم تجهيز الملف المشفّر للتنزيل.';
});

protect('decrypt', async (passphrase) => {
  const file = byId('import').files[0];
  if (!file || file.size > 100000) return 'اختر ملف ملاحظات HGW مشفّر صالح.';
  const payload = JSON.parse(await file.text());
  if (payload.version !== 1) throw new Error('Unsupported file version');
  const salt = decode(payload.salt);
  const iv = decode(payload.iv);
  if (salt.length !== 16 || iv.length !== 12) throw new Error('Invalid encryption parameters');
  const key = await deriveKey(passphrase, salt, 'decrypt');
  const cleartext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, decode(payload.data));
  byId('note').value = new TextDecoder('utf-8', { fatal: true }).decode(cleartext);
  return 'تم فتح الملاحظات محليًا.';
});
