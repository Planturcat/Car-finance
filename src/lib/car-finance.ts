export const STORAGE_KEY = 'carfin-calc-v1';

export const DEFAULT_S = {
  price: 400000,
  deposit: 0,
  rate: 10,
  term: 60,
  balloon: 15,
  initFee: 0,
  adminFee: 0,
  takeHome: 40000,
  expenses: 7500,
  insurance: 2500,
  running: 0,
  minLeft: 3000,
  tradeMonth: 24,
  resalePct: 70,
} as const;

export type FieldId = keyof typeof DEFAULT_S;
export type Scenario = Record<FieldId, number>;

export const FIELD_IDS = Object.keys(DEFAULT_S) as FieldId[];

export const DEFAULT_G = {
  metric: 'left' as Metric,
  rowBy: 'price' as RowBy,
  prices: '380k, 400k, 420k, 450k',
  rates: '8, 10, 13, 15',
  terms: [60, 72, 84],
  balloons: [15, 35],
  fixedRate: 10,
  fixedPrice: 400000,
};

export type Metric = 'pay' | 'left' | 'settle' | 'equity';
export type RowBy = 'price' | 'rate';

export type GridPrefs = {
  metric: Metric;
  rowBy: RowBy;
  prices: string;
  rates: string;
  terms: number[];
  balloons: number[];
  fixedRate: number;
  fixedPrice: number;
};

export type CalcResult = {
  term: number;
  principal: number;
  balloon: number;
  payment: number;
  k: number;
  bal: number;
  paid: number;
  interest: number;
  left: number;
  resale: number;
  equity: number;
};

export const TERM_OPTS = [48, 60, 72, 84, 96];
export const BAL_OPTS = [0, 15, 25, 35];

export const METRIC_TXT: Record<Metric, string> = {
  pay: 'Monthly finance payment. Colour shows what is left after your budget.',
  left: 'Left each month after expenses, insurance, running costs and the payment.',
  settle: 'What you would owe if you settle at the trade month, including the balloon.',
  equity: 'Estimated resale value minus what you would owe at the trade month.',
};

export function freshState(): { S: Scenario; G: GridPrefs } {
  return {
    S: { ...DEFAULT_S },
    G: {
      ...DEFAULT_G,
      terms: DEFAULT_G.terms.slice(),
      balloons: DEFAULT_G.balloons.slice(),
    },
  };
}

/** Merge a stored JSON string over defaults. Swallows parse errors. */
export function mergeStored(raw: string | null): { S: Scenario; G: GridPrefs } {
  const state = freshState();
  try {
    if (raw) {
      const o = JSON.parse(raw) as { S?: Partial<Scenario>; G?: Partial<GridPrefs> } | null;
      if (o && o.S) Object.assign(state.S, o.S);
      if (o && o.G) Object.assign(state.G, o.G);
    }
  } catch {
    /* swallow */
  }
  if (!Array.isArray(state.G.terms) || !state.G.terms.length) {
    state.G.terms = DEFAULT_G.terms.slice();
  }
  if (!Array.isArray(state.G.balloons) || !state.G.balloons.length) {
    state.G.balloons = DEFAULT_G.balloons.slice();
  }
  return state;
}

export function readStored(): { S: Scenario; G: GridPrefs } {
  try {
    return mergeStored(localStorage.getItem(STORAGE_KEY));
  } catch {
    return mergeStored(null);
  }
}

export function saveStored(S: Scenario, G: GridPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ S, G }));
  } catch {
    /* swallow */
  }
}

export function fmt(n: number): string {
  const r = Math.round(n);
  return (r < 0 ? '\u2212' : '') + 'R' + Math.abs(r).toLocaleString('en-US');
}

export function fmtK(n: number): string {
  const r = Math.round(n / 1000);
  return (r < 0 ? '\u2212' : '') + 'R' + Math.abs(r).toLocaleString('en-US') + 'k';
}

export function sgnK(n: number): string {
  const r = Math.round(n / 1000);
  return (r < 0 ? '\u2212' : '+') + 'R' + Math.abs(r).toLocaleString('en-US') + 'k';
}

export function priceLabel(n: number): string {
  return n % 1000 === 0 ? 'R' + (n / 1000).toLocaleString('en-US') + 'k' : fmt(n);
}

export function parseField(raw: string): number {
  const v = parseFloat(raw);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

export function parseScenario(text: Record<FieldId, string>): Scenario {
  const S = { ...DEFAULT_S } as Scenario;
  for (const k of FIELD_IDS) S[k] = parseField(text[k]);
  return S;
}

export function scenarioToText(S: Scenario): Record<FieldId, string> {
  const text = {} as Record<FieldId, string>;
  for (const k of FIELD_IDS) text[k] = String(S[k]);
  return text;
}

export function calc(S: Scenario, price: number, rate: number, term: number, balPct: number): CalcResult {
  term = Math.max(1, Math.round(term));
  const principal = Math.max(price - S.deposit, 0) + S.initFee;
  const balloon = Math.min((price * balPct) / 100, principal);
  const i = rate / 1200;
  let pmt: number;
  if (i === 0) pmt = (principal - balloon) / term;
  else
    pmt =
      (principal - balloon / Math.pow(1 + i, term)) * i / (1 - Math.pow(1 + i, -term));
  const payment = pmt + S.adminFee;
  const k = Math.min(Math.max(Math.round(S.tradeMonth), 0), term);
  let bal: number;
  if (i === 0) bal = principal - pmt * k;
  else {
    const g = Math.pow(1 + i, k);
    bal = principal * g - (pmt * (g - 1)) / i;
  }
  const paid = payment * k;
  const interest = pmt * k - (principal - bal);
  const left = S.takeHome - S.expenses - S.insurance - S.running - payment;
  const resale = (price * S.resalePct) / 100;
  return {
    term,
    principal,
    balloon,
    payment,
    k,
    bal,
    paid,
    interest,
    left,
    resale,
    equity: resale - bal,
  };
}

export function leftStatus(S: Scenario, left: number): 'bad' | 'warn' | 'good' {
  return left < 0 ? 'bad' : left < S.minLeft ? 'warn' : 'good';
}

export function parseList(str: string, isPrice: boolean): number[] {
  const out: number[] = [];
  String(str)
    .split(/[,;\s]+/)
    .forEach((token) => {
      if (!token) return;
      const t = token.replace(/^R/i, '').replace('%', '');
      const mult = /k$/i.test(t) ? 1000 : 1;
      const n = parseFloat(t) * mult;
      if (!Number.isFinite(n)) return;
      if (isPrice ? n <= 0 : n < 0) return;
      if (out.indexOf(n) === -1) out.push(n);
    });
  return out.slice(0, 8);
}

export function toggleValue(arr: number[], v: number): number[] {
  const next = arr.slice();
  const i = next.indexOf(v);
  if (i > -1) {
    if (next.length > 1) next.splice(i, 1);
  } else next.push(v);
  return next;
}
