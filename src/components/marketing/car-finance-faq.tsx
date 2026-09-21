'use client';

import Container from '../global/container';

const ITEMS = [
  {
    q: 'Why does this exist?',
    a: 'Nazeer built Neros Finance Application while looking to buy a car — to check affordability, residual risk, and monthly leftover without rebuilding the maths every time. It’s open source so others can use it or learn from a Next.js site that mixes marketing UI with real client-side logic.',
  },
  {
    q: 'Is this a quote from a bank?',
    a: 'No. Results are estimates from standard amortisation. Real offers may add fees, VAT, or a different rate method.',
  },
  {
    q: 'What does “left over” mean?',
    a: 'Take-home pay minus expenses, insurance, running costs, and the finance payment. Status colours flag when you’re under your minimum buffer.',
  },
  {
    q: 'What is the compare grid for?',
    a: 'Scan payments, leftover cash, settlement, or equity across prices, rates, terms, and balloons. Tap a cell to load it into the calculator.',
  },
];

const CarFinanceFaq = () => {
  return (
    <section id="disclaimer" className="relative w-full py-20 md:py-32 bg-background">
      <Container>
        <div className="max-w-7xl mx-auto px-4">
          <Container delay={0.1}>
            <p className="text-sm font-mono text-foreground/40 mb-4">&lt;notes&gt;</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight mb-6">
              Estimates, not advice
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mb-14 leading-relaxed">
              Use this tool to explore numbers. It isn&apos;t financial advice and shouldn&apos;t
              replace a formal quote or professional guidance. MIT-licensed open source by Nazeer.
            </p>
          </Container>

          <div className="max-w-3xl space-y-10">
            {ITEMS.map((item, index) => (
              <Container key={item.q} delay={0.15 + index * 0.08}>
                <div className="space-y-2 border-b border-foreground/10 pb-8">
                  <h3 className="text-lg md:text-xl font-heading font-bold text-foreground">
                    {item.q}
                  </h3>
                  <p className="text-base text-foreground/65 leading-relaxed">{item.a}</p>
                </div>
              </Container>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CarFinanceFaq;
