import assert from 'node:assert/strict';
import {
  DEFAULT_S,
  STORAGE_KEY,
  buildDealerMessage,
  calc,
  fmt,
  fmtK,
  leftStatus,
  mergeStored,
  parseList,
  priceLabel,
  sgnK,
  toggleValue,
} from './car-finance';

const S = { ...DEFAULT_S };

assert.equal(STORAGE_KEY, 'carfin-calc-v1');

assert.equal(fmt(1234.4), 'R1,234');
assert.equal(fmt(1.5), 'R2');
assert.equal(fmt(-1.5), '\u2212R1');
assert.equal(fmt(-1234.6), '\u2212R1,235');
assert.equal(fmtK(1500), 'R2k');
assert.equal(fmtK(-1500), '\u2212R1k');
assert.equal(sgnK(0), '+R0k');
assert.equal(sgnK(1499), '+R1k');
assert.equal(sgnK(-1500), '\u2212R1k');
assert.equal(priceLabel(400000), 'R400k');
assert.equal(priceLabel(1500), 'R1,500');
assert.equal(priceLabel(400500), 'R400,500');

assert.equal(leftStatus(S, -1), 'bad');
assert.equal(leftStatus(S, 0), 'warn');
assert.equal(leftStatus(S, 2999.99), 'warn');
assert.equal(leftStatus(S, 3000), 'good');
assert.equal(leftStatus({ ...S, minLeft: 0 }, 0), 'good');

const zero = calc(
  { ...S, deposit: 20000, adminFee: 50, tradeMonth: 24, resalePct: 70 },
  120000,
  0,
  12,
  0
);
assert.equal(zero.principal, 100000);
assert.equal(zero.balloon, 0);
assert.equal(zero.term, 12);
assert.equal(zero.payment, 100000 / 12 + 50);
assert.equal(zero.k, 12);
assert.equal(zero.bal, 0);
assert.equal(zero.interest, 0);
assert.equal(zero.paid, zero.payment * 12);
assert.equal(zero.equity, zero.resale - zero.bal);

const capped = calc({ ...S, deposit: 80000, initFee: 0 }, 100000, 0, 10, 50);
assert.equal(capped.principal, 20000);
assert.equal(capped.balloon, 20000);
assert.equal(capped.payment, 0);

const early = calc({ ...S, tradeMonth: 99 }, 400000, 10, 60, 15);
assert.equal(early.k, 60);
assert.equal(early.term, 60);

const base = calc(S, S.price, S.rate, S.term, S.balloon);
assert.equal(base.principal, 400000);
assert.equal(base.balloon, 60000);
assert.ok(base.payment > 0);
assert.equal(base.k, 24);
assert.equal(base.left, S.takeHome - S.expenses - S.insurance - S.running - base.payment);
assert.equal(base.resale, 280000);
assert.equal(base.equity, base.resale - base.bal);
assert.equal(base.paid, base.payment * base.k);
assert.equal(leftStatus(S, base.left), base.left < 0 ? 'bad' : base.left < S.minLeft ? 'warn' : 'good');

assert.deepEqual(parseList('380k, 400k; 420k 450k', true), [380000, 400000, 420000, 450000]);
assert.deepEqual(parseList('R400k', true), [400000]);
assert.deepEqual(parseList('8, 10, 13, 15', false), [8, 10, 13, 15]);
assert.deepEqual(parseList('10%', false), [10]);
assert.deepEqual(parseList('10, 10, 8', false), [10, 8]);
assert.deepEqual(parseList('0, -1, 5', true), [5]);
assert.deepEqual(parseList('0, -1, 5', false), [0, 5]);
assert.equal(parseList('1,2,3,4,5,6,7,8,9', false).length, 8);
assert.deepEqual(parseList('', true), []);

const merged = mergeStored(
  JSON.stringify({ S: { price: 10 }, G: { metric: 'pay', terms: [], balloons: null } })
);
assert.equal(merged.S.price, 10);
assert.equal(merged.S.deposit, 0);
assert.equal(merged.G.metric, 'pay');
assert.deepEqual(merged.G.terms, [60, 72, 84]);
assert.deepEqual(merged.G.balloons, [15, 35]);
assert.deepEqual(mergeStored('not-json').S, { ...DEFAULT_S });
assert.deepEqual(toggleValue([60], 60), [60]);
assert.deepEqual(toggleValue([60, 72], 60), [72]);
assert.deepEqual(toggleValue([60], 72), [60, 72]);

const msg = buildDealerMessage(S, base);
assert.ok(msg.includes(priceLabel(S.price)));
assert.ok(msg.includes(fmt(base.payment)));
assert.ok(!msg.toLowerCase().includes('bmw'));
assert.ok(!msg.includes('\u2014'));
assert.ok(msg.includes(`${S.rate}%`));
assert.ok(msg.includes(`${base.term} months`));

console.log('car-finance checks passed');
console.log(
  'default payment',
  base.payment,
  'left',
  base.left,
  'bal',
  base.bal,
  'interest',
  base.interest
);
