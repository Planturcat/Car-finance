import { Inter, Poppins } from 'next/font/google';
import localFont from 'next/font/local';

export const pressStart2P = localFont({
  src: '../../public/fonts/PressStart2P-Regular.ttf',
  weight: '400',
  variable: '--font-press-start',
});

export const futura = localFont({
  src: [
    {
      path: '../../public/fonts/futurabt-light-webfont.woff2',
      weight: '300',
    },
    {
      path: '../../public/fonts/futura-book-webfont.woff2',
      weight: '400',
    },
    {
      path: '../../public/fonts/futura-bold-webfont.woff2',
      weight: '700',
    },
  ],
  variable: '--font-futura',
});

export const satoshi = Poppins({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
