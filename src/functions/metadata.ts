import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site-url';

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string | null;
  icons?: Metadata['icons'];
  noIndex?: boolean;
  keywords?: string[];
  author?: string;
  twitterHandle?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: string;
  alternates?: Record<string, string>;
  publishedTime?: string;
  modifiedTime?: string;
}

export const generateMetadata = ({
  title = 'Neros Finance Application',
  description =
    'Open-source car finance calculator by Nazeer — monthly payment, balloon, budget leftover, and early trade estimates.',
  image = '/images/icon.png',
  icons = {
    icon: [{ url: '/images/icon.png', type: 'image/png' }],
    apple: [{ url: '/images/icon.png', type: 'image/png' }],
  },
  noIndex = false,
  keywords = [
    'neros finance',
    'car finance calculator',
    'balloon payment',
    'vehicle finance',
    'monthly car payment',
    'open source',
  ],
  author = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Nazeer',
  twitterHandle,
  type = 'website',
  locale = 'en_US',
  alternates = {},
  publishedTime,
  modifiedTime,
}: MetadataProps = {}): Metadata => {
  const metadataBase = new URL(getSiteUrl());
  const imageUrl = image ? new URL(image, metadataBase).toString() : null;

  return {
    metadataBase,
    title: {
      default: title,
      template: '%s',
    },
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: process.env.NEXT_PUBLIC_APP_NAME || title,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons,
    manifest: '/manifest.webmanifest',

    openGraph: {
      type,
      siteName: process.env.NEXT_PUBLIC_APP_NAME || title,
      title,
      description,
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1536,
            height: 1024,
            alt: title,
          },
        ],
      }),
      locale,
      alternateLocale: Object.keys(alternates),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    twitter: {
      card: 'summary_large_image',
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    },
  };
};
