import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import { ClientLayoutWrappers } from '@/components/layout/ClientLayoutWrappers';


// Latin/English font - Inter fallback
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Hindi & Marathi (Devanagari script)
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// Gujarati script
const notoGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  variable: '--font-gujarati',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Parichay | India\'s #1 Digital Business Card & Lead Gen Platform',
  description: 'Transform every meeting into a lead. Create professional digital business cards, microsites, and catalogs in seconds. Smart, paperless, and outcome-driven.',
  keywords: ['digital business card', 'microsite builder', 'lead generation', 'india business', 'parichay', 'digital profile'],
  authors: [{ name: 'Parichay Team' }],
  openGraph: {
    title: 'Parichay | Smart Digital Introduction',
    description: 'India\'s #1 Digital Business Card & Lead Gen Platform',
    url: 'https://parichay.io',
    siteName: 'Parichay',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any" />
      </head>
      <body className={`${inter.variable} ${notoDevanagari.variable} ${notoGujarati.variable} font-sans`}>
        <ClientLayoutWrappers>
          {children}
        </ClientLayoutWrappers>
        <ToastContainer />
      </body>

    </html>
  );
}