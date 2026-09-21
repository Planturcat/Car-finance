'use client';

import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { BlurText } from '../ui/blur-text';
import { Button } from '../ui/button';
import Container from '../global/container';

const CarFinanceHero = () => {
  return (
    <section
      id="home"
      className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-background"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'url(/images/noise.svg)',
          backgroundSize: '180px 180px',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_20%_0%,hsl(var(--foreground)/0.06),transparent_55%),linear-gradient(180deg,hsl(var(--foreground)/0.03),transparent_40%)]"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div className="flex flex-col items-start text-left space-y-6">
            <Container delay={0.1}>
              <p className="text-sm md:text-base font-heading font-bold tracking-tight text-foreground">
                Neros Finance Application
              </p>
            </Container>

            <Container delay={0.2}>
              <BlurText
                word="Know if the car still fits your life."
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold tracking-tight text-foreground !leading-tight text-left"
                duration={0.85}
              />
            </Container>

            <Container delay={0.35}>
              <p className="text-base lg:text-lg text-foreground/70 leading-relaxed max-w-lg">
                I built this while shopping for a vehicle — tired of re-running numbers every month
                and explaining my budget to chatbots. Open source, by Nazeer: payment, balloon,
                leftover cash, and what you&apos;d still owe if you trade early.
              </p>
            </Container>

            <Container delay={0.45}>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Button asChild size="lg" className="shadow-none">
                  <Link href="/#calculator">
                    Open calculator
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="shadow-none">
                  <Link href="/#how">How it works</Link>
                </Button>
              </div>
            </Container>
          </div>

          <Container delay={0.55}>
            <div className="relative group w-full">
              <div className="absolute -top-2 -left-2 w-10 h-10 border-l-2 border-t-2 border-primary/40 group-hover:border-primary transition-colors duration-300 z-20" />
              <div className="absolute -top-2 -right-2 w-10 h-10 border-r-2 border-t-2 border-primary/40 group-hover:border-primary transition-colors duration-300 z-20" />
              <div className="absolute -bottom-2 -left-2 w-10 h-10 border-l-2 border-b-2 border-primary/40 group-hover:border-primary transition-colors duration-300 z-20" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 border-r-2 border-b-2 border-primary/40 group-hover:border-primary transition-colors duration-300 z-20" />

              <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground text-background min-h-[320px] md:min-h-[420px] p-8 md:p-10 flex flex-col justify-between">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'url(/images/noise.svg)',
                    backgroundSize: '120px 120px',
                  }}
                  aria-hidden
                />
                <div className="relative">
                  <p className="text-xs font-mono text-background/50 mb-3">{'//'} left each month</p>
                  <p className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight">
                    R 4,280
                  </p>
                  <p className="mt-3 text-sm text-background/60 max-w-xs leading-relaxed">
                    After finance, insurance, and running costs — so you can see if the deal fits.
                  </p>
                </div>
                <div className="relative grid grid-cols-2 gap-6 pt-8 border-t border-background/15">
                  <div>
                    <p className="text-xs font-mono text-background/45 mb-1">payment</p>
                    <p className="text-lg font-heading font-bold">R 6,450</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-background/45 mb-1">balloon</p>
                    <p className="text-lg font-heading font-bold">25%</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default CarFinanceHero;
