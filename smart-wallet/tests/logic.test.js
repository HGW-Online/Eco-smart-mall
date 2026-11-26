import test from 'node:test';
import assert from 'node:assert/strict';
import { toWei, fromWei, checkTransfer } from '../src/logic.js';

const self = '0x' + 'a'.repeat(40);
const other = '0x' + 'b'.repeat(40);
const base = { to: other, amount: '0.5', balance: 10n ** 18n, self };

test('amount conversion is exact', () => {
  assert.equal(toWei('0.000000000000000001'), 1n);
  assert.equal(toWei('1.5'), 1500000000000000000n);
  assert.equal(fromWei(1n), '0.000000000000000001');
  assert.equal(fromWei(0n), '0');
  assert.equal(fromWei(toWei('123.45')), '123.45');
});
test('invalid amounts are rejected', () => {
  for (const bad of ['', '0', '-1', '1e3', '1,5', '.5', '0.0000000000000000001']) assert.throws(() => toWei(bad), undefined, bad);
});
test('transfer checks', () => {
  assert.deepEqual(checkTransfer(base), { to: other, value: toWei('0.5') });
  for (const change of [{ to: '0x12' }, { to: '0x' + '0'.repeat(40) }, { to: self }, { amount: '2' }, { balance: null }])
    assert.throws(() => checkTransfer({ ...base, ...change }));
});
