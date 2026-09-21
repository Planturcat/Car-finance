import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();
  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
