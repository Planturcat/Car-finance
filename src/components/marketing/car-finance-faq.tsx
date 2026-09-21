'use client';

import Container from '../global/container';

const ITEMS = [
  {
    q: 'Why does this exist?',
    a: 'I just wanted to calculate the financials myself  payment, leftover cash, balloons, the lot. Also I want a BMW. This is how I’m trying to see if that’s a plan or a cry for help.',
  },
  {
    q: 'Is this a quote from a bank?',
    a: 'No. It’s a quick estimate so you can play with numbers before talking to anyone in a suit.',
  },
  {
    q: 'What does “left over” mean?',
    a: 'Take-home pay minus expenses, insurance, running costs, and the finance payment. Colours flag when you’re under your minimum buffer.',
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
              A few notes
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mb-14 leading-relaxed">
              Built to run the numbers on a car deal  mostly so I can keep telling myself that BMW
              is still on the table.
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
