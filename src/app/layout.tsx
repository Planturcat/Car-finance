import '@/styles/globals.css';
import { cn, generateMetadata } from '@/functions';
import { inter, satoshi, futura, pressStart2P } from '@/constants';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components';
import type { Viewport } from 'next';

export const metadata = generateMetadata();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background text-foreground antialiased font-default overflow-x-hidden !scrollbar-hide',
          inter.variable,
          satoshi.variable,
          futura.variable,
          pressStart2P.variable
        )}
      >
        <Toaster richColors theme="dark" position="top-right" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
