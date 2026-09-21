'use client';

import Link from 'next/link';
import Image from 'next/image';
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
              <Image
                src="/images/icon.png"
                alt="Nazeer Yazeed Ngunga — Neros Finance"
                width={1536}
                height={1024}
                className="h-16 md:h-20 w-auto rounded-lg"
                priority
              />
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

              <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-black min-h-[280px] md:min-h-[400px]">
                <Image
                  src="/images/icon.png"
                  alt="Nazeer Yazeed Ngunga"
                  fill
                  className="object-contain p-6 md:p-10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default CarFinanceHero;
