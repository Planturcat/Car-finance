'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { cn } from '@/functions';
import {
  BAL_OPTS,
  METRIC_TXT,
  TERM_OPTS,
  type FieldId,
  type GridPrefs,
  type Metric,
  type RowBy,
  type Scenario,
  calc,
  fmt,
  fmtK,
  freshState,
  leftStatus,
  parseList,
  parseScenario,
  priceLabel,
  readStored,
  saveStored,
  scenarioToText,
  sgnK,
  toggleValue,
} from '@/lib/car-finance';
import Container from '@/components/global/container';

type FieldConfig = {
  id: FieldId;
  label: string;
  pre?: string;
  suf?: string;
  step?: string;
  chips?: number[];
  chipSuffix?: string;
  wide?: boolean;
  hint?: string;
};

const GROUPS: { title: string; fields: FieldConfig[] }[] = [
  {
    title: 'The car',
    fields: [
      { id: 'price', label: 'Car price', pre: 'R' },
      { id: 'deposit', label: 'Deposit', pre: 'R' },
      {
        id: 'rate',
        label: 'Interest rate',
        suf: '% a year',
        step: '0.25',
        chips: [8, 10, 13, 15],
        chipSuffix: '%',
        wide: true,
      },
      {
        id: 'term',
        label: 'Term',
        suf: 'months',
        chips: [60, 72, 84],
        chipSuffix: '',
        wide: true,
      },
      {
        id: 'balloon',
        label: 'Balloon (final payment)',
        suf: '% of price',
        chips: [0, 15, 25, 35],
        chipSuffix: '%',
        wide: true,
      },
    ],
  },
  {
    title: 'Bank fees (optional)',
    fields: [
      { id: 'initFee', label: 'Initiation fee', pre: 'R', hint: 'Added to the loan' },
      { id: 'adminFee', label: 'Monthly admin fee', pre: 'R', hint: 'Added to each payment' },
    ],
  },
  {
    title: 'Your monthly budget',
    fields: [
      { id: 'takeHome', label: 'Take-home pay', pre: 'R' },
      {
        id: 'expenses',
        label: 'Recurring expenses',
        pre: 'R',
        hint: 'Rent, groceries, subscriptions',
      },
      { id: 'insurance', label: 'Car insurance', pre: 'R' },
      { id: 'running', label: 'Running costs', pre: 'R', hint: 'Fuel, tyres, service' },
      {
        id: 'minLeft',
        label: 'Minimum to keep left over',
        pre: 'R',
        wide: true,
        hint: 'Results turn amber below this',
      },
    ],
  },
  {
    title: 'Trading it in',
    fields: [
      {
        id: 'tradeMonth',
        label: 'Trade the car after',
        suf: 'months',
        chips: [12, 24, 36],
        chipSuffix: ' mo',
        wide: true,
      },
      {
        id: 'resalePct',
        label: 'Expected resale value',
        suf: '% of price',
        chips: [65, 70, 75, 80],
        chipSuffix: '%',
        wide: true,
        hint: 'What you think it will fetch at that point',
      },
    ],
  },
];

const METRICS: { id: Metric; label: string }[] = [
  { id: 'pay', label: 'Payment' },
  { id: 'left', label: 'Left over' },
  { id: 'settle', label: 'Owed' },
  { id: 'equity', label: 'Equity' },
];

const ROW_BY: { id: RowBy; label: string }[] = [
  { id: 'price', label: 'Car prices' },
  { id: 'rate', label: 'Interest rates' },
];

const SEG = {
  exp: 'hsl(var(--muted-foreground) / 0.55)',
  ins: 'hsl(var(--muted-foreground) / 0.4)',
  run: 'hsl(var(--muted-foreground) / 0.28)',
  fin: 'hsl(var(--foreground))',
};

function statusWord(st: 'good' | 'warn' | 'bad') {
  return st === 'good' ? 'comfortable' : st === 'warn' ? 'tight' : 'over budget or underwater';
}

function statusText(st: 'good' | 'warn' | 'bad') {
  return st === 'good'
    ? 'text-emerald-700 dark:text-emerald-400'
    : st === 'warn'
      ? 'text-amber-700 dark:text-amber-400'
      : 'text-red-700 dark:text-red-400';
}

function statusCell(st: 'good' | 'warn' | 'bad') {
  return st === 'good'
    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
    : st === 'warn'
      ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
      : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300';
}

function statusSwatch(st: 'good' | 'warn' | 'bad') {
  return st === 'good'
    ? 'bg-emerald-600 dark:bg-emerald-400'
    : st === 'warn'
      ? 'bg-amber-500 dark:bg-amber-400'
      : 'bg-red-600 dark:bg-red-400';
}

const inputBox =
  'flex items-stretch rounded-lg border border-foreground/15 bg-background overflow-hidden focus-within:border-foreground/40 transition-colors duration-300';
const inputEl =
  'min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
const chipBtn =
  'rounded-md border border-foreground/15 bg-background px-2.5 py-1 text-xs text-foreground/80 hover:border-foreground/30 hover:text-foreground transition-colors duration-300 aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background';
const segBtn =
  'px-3 py-1.5 text-xs sm:text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 aria-pressed:bg-foreground aria-pressed:text-background';

const Calculator = () => {
  const initial = freshState();
  const [text, setText] = useState(() => scenarioToText(initial.S));
  const [grid, setGrid] = useState<GridPrefs>(initial.G);

  useEffect(() => {
    const stored = readStored();
    setText(scenarioToText(stored.S));
    setGrid(stored.G);
  }, []);

  const S: Scenario = parseScenario(text);
  const result = calc(S, S.price, S.rate, S.term, S.balloon);
  const st = leftStatus(S, result.left);

  function commitText(next: Record<FieldId, string>) {
    setText(next);
    saveStored(parseScenario(next), grid);
  }

  function commitGrid(next: GridPrefs) {
    setGrid(next);
    saveStored(S, next);
  }

  function onGridClick(event: MouseEvent<HTMLTableElement>) {
    const button = (event.target as HTMLElement).closest('button[data-price]');
    if (!button) return;
    const price = parseFloat(button.getAttribute('data-price') || '');
    const rate = parseFloat(button.getAttribute('data-rate') || '');
    const term = parseFloat(button.getAttribute('data-term') || '');
    const balloon = parseFloat(button.getAttribute('data-bal') || '');
    const next = {
      ...text,
      price: String(price),
      rate: String(rate),
      term: String(term),
      balloon: String(balloon),
    };
    setText(next);
    saveStored(parseScenario(next), grid);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('result')?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  const segs = [
    { name: 'Expenses', amount: S.expenses, color: SEG.exp },
    { name: 'Insurance', amount: S.insurance, color: SEG.ins },
    { name: 'Running costs', amount: S.running, color: SEG.run },
    { name: 'Finance', amount: result.payment, color: SEG.fin },
    {
      name: 'Left over',
      amount: Math.max(result.left, 0),
      color:
        st === 'bad'
          ? 'hsl(142 70% 35%)'
          : st === 'warn'
            ? 'hsl(38 90% 40%)'
            : 'hsl(142 70% 35%)',
    },
  ];
  const total = segs.reduce((sum, seg) => sum + seg.amount, 0) || 1;
  const visibleSegs = segs.filter((seg) => seg.amount > 0);

  const prices = parseList(grid.prices, true);
  const rates = parseList(grid.rates, false);
  const priceRows = prices.length ? prices : [S.price];
  const rateRows = rates.length ? rates : [S.rate];
  const terms = grid.terms.slice().sort((a, b) => a - b);
  const bals = grid.balloons.slice().sort((a, b) => a - b);
  const byPrice = grid.rowBy === 'price';
  const fixedRate = rateRows.indexOf(grid.fixedRate) > -1 ? grid.fixedRate : rateRows[0];
  const fixedPrice = priceRows.indexOf(grid.fixedPrice) > -1 ? grid.fixedPrice : priceRows[0];
  const rows = byPrice ? priceRows : rateRows;
  const fixedOptions = byPrice ? rateRows : priceRows;
  const cap = byPrice
    ? `at ${fixedRate}% interest`
    : `for a ${priceLabel(fixedPrice)} car`;
  const metricName = {
    pay: 'Monthly payment',
    left: 'Left each month',
    settle: `Owed at month ${Math.round(S.tradeMonth)}`,
    equity: `Equity at month ${Math.round(S.tradeMonth)}`,
  }[grid.metric];
  const pastTerm = Math.round(S.tradeMonth) > result.term;
  const ahead = result.equity >= 0;
  const mx = Math.max(S.price, result.bal, result.resale, 1);

  const statusCopy =
    st === 'bad'
      ? "The payment doesn't fit your budget."
      : st === 'warn'
        ? `Under your ${fmt(S.minLeft)} minimum.`
        : `Above your ${fmt(S.minLeft)} minimum.`;

  return (
    <section id="calculator" className="relative w-full py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <Container delay={0.05}>
          <p className="text-sm font-mono text-foreground/40 mb-4">&lt;calculator&gt;</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight mb-2">
            Run your numbers
          </h2>
          <p className="text-base text-foreground/60 mb-10 max-w-xl leading-relaxed">
            Adjust the deal and budget. Results update instantly and stay on this device.
          </p>
        </Container>

        <Container delay={0.1}>
          <div
            id="result"
            className="scroll-mt-28 mb-12 rounded-2xl border border-foreground/10 bg-background p-6 md:p-8"
            aria-live="polite"
          >
            <p className="text-xs font-mono text-foreground/40 mb-2">Left each month after the car</p>
            <p className={cn('text-4xl md:text-5xl font-heading font-bold tracking-tight', statusText(st))}>
              {fmt(result.left)}
            </p>
            <p className={cn('mt-2 text-sm', statusText(st))}>{statusCopy}</p>

            <div
              className={cn(
                'mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-foreground/5',
                result.left < 0 && 'ring-1 ring-red-500/40'
              )}
              role="img"
              aria-label={`Monthly budget split: ${segs.map((seg) => `${seg.name} ${fmt(seg.amount)}`).join(', ')}`}
            >
              {visibleSegs.map((seg) => (
                <i
                  key={seg.name}
                  className="block h-full"
                  style={{ width: `${(seg.amount / total) * 100}%`, background: seg.color }}
                />
              ))}
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-foreground/60">
              {visibleSegs.map((seg) => (
                <li key={seg.name} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-sm"
                    style={{ background: seg.color }}
                  />
                  {seg.name}{' '}
                  <b className="font-medium text-foreground">{fmt(seg.amount)}</b>
                </li>
              ))}
            </ul>

            <dl className="mt-8 space-y-3 border-t border-foreground/10 pt-6">
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-foreground/55">Monthly finance payment</dt>
                <dd className="font-medium text-foreground text-right">
                  {fmt(result.payment)}
                  {S.adminFee > 0 ? ' incl. admin fee' : ''}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-foreground/55">Balloon due at month {result.term}</dt>
                <dd className="font-medium text-foreground">{fmt(result.balloon)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-foreground/55">Owed if you trade at month {result.k}</dt>
                <dd className="font-medium text-foreground">{fmt(result.bal)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-foreground/55">Paid so far</dt>
                <dd className="font-medium text-foreground">{fmt(result.paid)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-sm pl-4">
                <dt className="text-foreground/45">of which interest</dt>
                <dd className="text-foreground/70">{fmt(result.interest)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-foreground/55">Car worth then (estimate)</dt>
                <dd className="font-medium text-foreground">{fmt(result.resale)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-foreground/55">
                  {ahead ? 'You would come out ahead by' : 'You would still owe after selling'}
                </dt>
                <dd className={cn('font-medium', ahead ? statusText('good') : statusText('bad'))}>
                  {fmt(Math.abs(result.equity))}
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3 text-xs text-foreground/55">
              <div>
                <div className="mb-1 flex justify-between">
                  <span>You&apos;d owe</span>
                </div>
                <span className="block h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <i
                    className="block h-full bg-foreground"
                    style={{ width: `${(result.bal / mx) * 100}%` }}
                  />
                </span>
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span>Car worth</span>
                </div>
                <span className="block h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <i
                    className="block h-full bg-foreground/45"
                    style={{ width: `${(result.resale / mx) * 100}%` }}
                  />
                </span>
              </div>
            </div>

            {pastTerm ? (
              <p className="mt-4 text-xs text-foreground/50 leading-relaxed">
                Your trade month is past the {result.term}-month term, so the amount owed shown is
                the balloon.
              </p>
            ) : null}
          </div>
        </Container>

        <div id="inputs" className="space-y-10">
          {GROUPS.map((group, gIndex) => (
            <Container key={group.title} delay={0.05 + gIndex * 0.04}>
              <div>
                <h3 className="text-lg font-heading font-bold text-foreground tracking-tight mb-4">
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.fields.map((field) => (
                    <div
                      key={field.id}
                      className={cn(field.wide && 'sm:col-span-2')}
                    >
                      <label
                        htmlFor={field.id}
                        className="mb-1.5 block text-sm text-foreground/70"
                      >
                        {field.label}
                      </label>
                      <div className={inputBox}>
                        {field.pre ? (
                          <span className="flex items-center px-3 text-sm text-foreground/45 border-r border-foreground/10">
                            {field.pre}
                          </span>
                        ) : null}
                        <input
                          id={field.id}
                          type="number"
                          inputMode="decimal"
                          step={field.step || 'any'}
                          min={0}
                          value={text[field.id]}
                          onChange={(event) =>
                            commitText({ ...text, [field.id]: event.target.value })
                          }
                          className={inputEl}
                        />
                        {field.suf ? (
                          <span className="flex items-center px-3 text-xs text-foreground/45 border-l border-foreground/10 whitespace-nowrap">
                            {field.suf}
                          </span>
                        ) : null}
                      </div>
                      {field.chips ? (
                        <div className="mt-2 flex flex-wrap gap-1.5" data-for={field.id}>
                          {field.chips.map((value) => (
                            <button
                              key={value}
                              type="button"
                              className={chipBtn}
                              data-v={value}
                              aria-pressed={parseFloat(text[field.id]) === value}
                              onClick={(event) => {
                                const raw = event.currentTarget.getAttribute('data-v') || '';
                                commitText({ ...text, [field.id]: raw });
                              }}
                            >
                              {value}
                              {field.chipSuffix}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {field.hint ? (
                        <p className="mt-1.5 text-xs text-foreground/45">{field.hint}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          ))}
        </div>

        <Container delay={0.15}>
          <div
            id="compare"
            className="scroll-mt-28 mt-16 pt-12 border-t border-foreground/10"
            aria-labelledby="cmpTitle"
          >
            <h3
              id="cmpTitle"
              className="text-lg font-heading font-bold text-foreground tracking-tight mb-6"
            >
              Compare options
            </h3>

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-xs font-mono text-foreground/40 shrink-0 w-28">Show</span>
                <div className="inline-flex flex-wrap rounded-lg border border-foreground/15 overflow-hidden">
                  {METRICS.map((metric) => (
                    <button
                      key={metric.id}
                      type="button"
                      className={segBtn}
                      data-metric={metric.id}
                      aria-pressed={grid.metric === metric.id}
                      onClick={() => commitGrid({ ...grid, metric: metric.id })}
                    >
                      {metric.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-xs font-mono text-foreground/40 shrink-0 w-28">Rows</span>
                <div className="inline-flex flex-wrap rounded-lg border border-foreground/15 overflow-hidden">
                  {ROW_BY.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      className={segBtn}
                      data-rowby={row.id}
                      aria-pressed={grid.rowBy === row.id}
                      onClick={() => commitGrid({ ...grid, rowBy: row.id })}
                    >
                      {row.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gPrices" className="mb-1.5 block text-sm text-foreground/70">
                    Car prices
                  </label>
                  <div className={inputBox}>
                    <input
                      id="gPrices"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      placeholder="380k, 400k, 420k"
                      value={grid.prices}
                      onChange={(event) => commitGrid({ ...grid, prices: event.target.value })}
                      className={inputEl}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="gRates" className="mb-1.5 block text-sm text-foreground/70">
                    Interest rates
                  </label>
                  <div className={inputBox}>
                    <input
                      id="gRates"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      placeholder="8, 10, 13, 15"
                      value={grid.rates}
                      onChange={(event) => commitGrid({ ...grid, rates: event.target.value })}
                      className={inputEl}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-xs font-mono text-foreground/40 shrink-0 w-28 pt-1">
                  Terms (months)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TERM_OPTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={chipBtn}
                      data-v={value}
                      aria-pressed={grid.terms.indexOf(value) > -1}
                      onClick={(event) => {
                        const v = parseFloat(event.currentTarget.getAttribute('data-v') || '');
                        commitGrid({ ...grid, terms: toggleValue(grid.terms, v) });
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-xs font-mono text-foreground/40 shrink-0 w-28 pt-1">
                  Balloon (% of price)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BAL_OPTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={chipBtn}
                      data-v={value}
                      aria-pressed={grid.balloons.indexOf(value) > -1}
                      onClick={(event) => {
                        const v = parseFloat(event.currentTarget.getAttribute('data-v') || '');
                        commitGrid({ ...grid, balloons: toggleValue(grid.balloons, v) });
                      }}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-xs font-mono text-foreground/40 shrink-0 w-28 pt-1" id="fixedLab">
                  {byPrice ? 'Interest rate' : 'Car price'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {fixedOptions.map((value) => {
                    const on = byPrice ? value === fixedRate : value === fixedPrice;
                    return (
                      <button
                        key={value}
                        type="button"
                        className={chipBtn}
                        data-v={value}
                        aria-pressed={on}
                        onClick={(event) => {
                          const v = parseFloat(event.currentTarget.getAttribute('data-v') || '');
                          commitGrid(
                            grid.rowBy === 'price'
                              ? { ...grid, fixedRate: v }
                              : { ...grid, fixedPrice: v }
                          );
                        }}
                      >
                        {byPrice ? `${value}%` : priceLabel(value)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="mt-6 mb-3 text-sm text-foreground/55">
              {metricName}, {cap}. {METRIC_TXT[grid.metric]}
            </p>

            <div className="overflow-x-auto border border-foreground/10 rounded-xl">
              <table className="w-full min-w-[640px] border-collapse text-xs" id="grid" onClick={onGridClick}>
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/[0.03]">
                    <th
                      className="sticky left-0 z-10 bg-background px-3 py-2 text-left font-medium text-foreground/60 border-r border-foreground/10"
                      rowSpan={2}
                    >
                      {byPrice ? 'Price' : 'Rate'}
                    </th>
                    {terms.map((term) => (
                      <th
                        key={term}
                        colSpan={bals.length}
                        className="px-2 py-2 text-center font-medium text-foreground/70 border-l border-foreground/10"
                      >
                        {term} months
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                    {terms.map((term) =>
                      bals.map((balloon) => (
                        <th
                          key={`${term}-${balloon}`}
                          className="px-1.5 py-1.5 text-center font-normal text-foreground/45 border-l border-foreground/5 whitespace-nowrap"
                        >
                          {balloon === 0 ? 'No balloon' : `${balloon}% balloon`}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const price = byPrice ? row : fixedPrice;
                    const rate = byPrice ? fixedRate : row;
                    return (
                      <tr key={row} className="border-b border-foreground/5 last:border-0">
                        <th
                          scope="row"
                          className="sticky left-0 z-10 bg-background px-3 py-1.5 text-left font-medium text-foreground border-r border-foreground/10 whitespace-nowrap"
                        >
                          {byPrice ? priceLabel(row) : `${row}%`}
                        </th>
                        {terms.map((term) =>
                          bals.map((balloon, index) => {
                            const cell = calc(S, price, rate, term, balloon);
                            let textValue: string;
                            let cellStatus: 'good' | 'warn' | 'bad';
                            if (grid.metric === 'pay') {
                              textValue = fmt(cell.payment);
                              cellStatus = leftStatus(S, cell.left);
                            } else if (grid.metric === 'left') {
                              textValue = fmt(cell.left);
                              cellStatus = leftStatus(S, cell.left);
                            } else if (grid.metric === 'settle') {
                              textValue = fmtK(cell.bal);
                              cellStatus = cell.equity < 0 ? 'bad' : 'good';
                            } else {
                              textValue = sgnK(cell.equity);
                              cellStatus = cell.equity < 0 ? 'bad' : 'good';
                            }
                            const current =
                              price === S.price &&
                              rate === S.rate &&
                              term === Math.round(S.term) &&
                              balloon === S.balloon;
                            const label = `${byPrice ? priceLabel(price) : `${rate}%`}, ${term} months, ${balloon}% balloon: ${textValue}, ${statusWord(cellStatus)}`;
                            return (
                              <td
                                key={`${term}-${balloon}`}
                                className={cn(
                                  'p-0.5',
                                  index === 0 && 'border-l border-foreground/10'
                                )}
                              >
                                <button
                                  type="button"
                                  className={cn(
                                    'w-full rounded-md px-1.5 py-2 font-medium transition-colors duration-300 hover:brightness-95',
                                    statusCell(cellStatus),
                                    current && 'ring-2 ring-foreground ring-inset'
                                  )}
                                  data-price={price}
                                  data-rate={rate}
                                  data-term={term}
                                  data-bal={balloon}
                                  aria-label={label}
                                >
                                  {textValue}
                                </button>
                              </td>
                            );
                          })
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="mt-4 flex flex-wrap gap-4 text-xs text-foreground/55">
              {grid.metric === 'pay' || grid.metric === 'left' ? (
                <>
                  <li className="inline-flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-sm', statusSwatch('good'))} />
                    {fmt(S.minLeft)} or more left
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-sm', statusSwatch('warn'))} />
                    Under {fmt(S.minLeft)}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-sm', statusSwatch('bad'))} />
                    Doesn&apos;t fit budget
                  </li>
                </>
              ) : (
                <>
                  <li className="inline-flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-sm', statusSwatch('good'))} />
                    Worth more than you owe
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-sm', statusSwatch('bad'))} />
                    You&apos;d owe more than it&apos;s worth (at {S.resalePct}% resale)
                  </li>
                </>
              )}
            </ul>
            <p className="mt-3 text-xs text-foreground/45">
              Tap any cell to load it into the calculator above.
            </p>
          </div>
        </Container>

        <p className="mt-12 text-xs text-foreground/45 leading-relaxed max-w-2xl">
          Standard amortisation with the balloon paid as one lump sum at the end of the term. Real
          quotes may add fees, VAT and a different rate calculation, so treat these as estimates.
          This isn&apos;t financial advice.
        </p>
      </div>
    </section>
  );
};

export default Calculator;
