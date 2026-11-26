// منطق مستقل بلا مكتبات حتى يمكن اختباره مباشرة.
export const isAddress = (v) => /^0x[0-9a-fA-F]{40}$/.test(v);

export function toWei(text) {
  const v = text.trim();
  if (!/^\d+(\.\d{1,18})?$/.test(v)) throw new Error('مبلغ غير صالح');
  const [whole, frac = ''] = v.split('.');
  const wei = BigInt(whole) * 10n ** 18n + BigInt(frac.padEnd(18, '0'));
  if (wei <= 0n) throw new Error('يجب أن يكون المبلغ أكبر من صفر');
  return wei;
}

export function fromWei(wei) {
  const s = wei.toString().padStart(19, '0');
  const frac = s.slice(-18).replace(/0+$/, '');
  return s.slice(0, -18) + (frac ? '.' + frac : '');
}

export function checkTransfer({ to, amount, balance, self }) {
  const recipient = to.trim();
  if (!isAddress(recipient)) throw new Error('عنوان المستلم غير صالح');
  if (/^0x0{40}$/.test(recipient)) throw new Error('لا يمكن الإرسال إلى العنوان الصفري');
  if (recipient.toLowerCase() === self.toLowerCase()) throw new Error('هذا عنوان محفظتك');
  const value = toWei(amount);
  if (balance === null) throw new Error('الرصيد لم يُحمّل بعد');
  if (value > balance) throw new Error('الرصيد غير كافٍ');
  return { to: recipient, value };
}
