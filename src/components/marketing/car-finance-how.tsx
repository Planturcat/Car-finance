'use client';

import Container from '../global/container';

const STEPS = [
  {
    tag: '// 01',
    title: 'Enter the deal',
    body: 'Price, deposit, rate, term, and balloon — plus optional bank fees if you have them.',
  },
  {
    tag: '// 02',
    title: 'Layer your budget',
    body: 'Add take-home pay, expenses, insurance, and running costs so leftover cash is honest.',
  },
  {
    tag: '// 03',
    title: 'Stress-test early exit',
    body: "Pick a trade-in month and expected resale to see what you'd still owe versus what the car is worth.",
  },
];

const CarFinanceHow = () => {
  return (
    <section id="how" className="relative w-full py-20 md:py-32 bg-background">
      <Container>
        <div className="max-w-7xl mx-auto px-4">
          <Container delay={0.1}>
            <p className="text-sm font-mono text-foreground/40 mb-4">&lt;how-it-works&gt;</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight mb-6">
              Three inputs. A clearer picture.
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mb-16 md:mb-20 leading-relaxed">
              Standard amortisation with the balloon due at the end of the term. Compare scenarios
              before you talk to a dealer — the same workflow I use when a new quote lands.
            </p>
          </Container>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-16">
            {STEPS.map((step, index) => (
              <Container key={step.title} delay={0.15 + index * 0.1}>
                <div className="space-y-4 border-l-2 border-foreground/10 pl-6">
                  <p className="text-xs font-mono text-foreground/40">{step.tag}</p>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-base text-foreground/65 leading-relaxed">{step.body}</p>
                </div>
              </Container>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CarFinanceHow;
