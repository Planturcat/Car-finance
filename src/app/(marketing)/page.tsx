import type { Metadata } from 'next';
import Calculator from '@/components/car-finance/calculator';
import CarFinanceHero from '@/components/marketing/car-finance-hero';
import CarFinanceHow from '@/components/marketing/car-finance-how';
import CarFinanceFaq from '@/components/marketing/car-finance-faq';
import { TextRevealByWord } from '@/components/ui/text-reveal';
import { getSiteUrl } from '@/lib/site-url';

const title = 'Neros Finance Application';
const description =
  'Open-source car finance calculator by Nazeer — monthly payment, balloon, budget leftover, and early trade estimates.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    'neros finance',
    'car finance calculator',
    'balloon payment',
    'vehicle finance',
    'South African rand',
    'open source',
  ],
  authors: [{ name: 'Nazeer' }],
  icons: {
    icon: [{ url: '/images/icon.png', type: 'image/png' }],
    apple: [{ url: '/images/icon.png', type: 'image/png' }],
  },
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: title,
    images: [{ url: '/images/icon.png', width: 1536, height: 1024, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/icon.png'],
  },
};

const HomePage = () => {
  const url = getSiteUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: title,
        url,
        description,
        author: { '@type': 'Person', name: 'Nazeer' },
      },
      {
        '@type': 'WebApplication',
        name: title,
        url,
        description,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        author: { '@type': 'Person', name: 'Nazeer' },
        license: 'https://opensource.org/licenses/MIT',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CarFinanceHero />
      <CarFinanceHow />
      <section className="relative w-full bg-background">
        <TextRevealByWord
          text="A deal only works if the monthly payment still leaves you room to live."
          className="bg-background"
        />
      </section>
      <Calculator />
      <CarFinanceFaq />
    </>
  );
};

export default HomePage;
