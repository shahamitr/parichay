import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from 'next/font/google';
import './globals.css';
import '../styles/cinematic.css';

import { ToastContainer } from '@/components/ui/Toast';
import { ClientLayoutWrappers } from '@/components/layout/ClientLayoutWrappers';
import CookieConsent from '@/components/CookieConsent';


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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Parichay" />
      </head>
      <body className={`${inter.variable} ${notoDevanagari.variable} ${notoGujarati.variable} font-sans`}>
        <ClientLayoutWrappers>
          {children}
        </ClientLayoutWrappers>
        <ToastContainer />
        <CookieConsent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>


    </html>
  );
}