/** Public site origin used by metadata, robots, and sitemap. No trailing slash. */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}
