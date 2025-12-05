import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";
import { I18nProvider } from "@/lib/i18n";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Hindi font support
const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Parichay - Dynamic Business Card Platform",
  description: "Create professional digital business cards with custom domains, QR codes, and analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansDevanagari.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            <I18nProvider>
              {children}
              <CookieConsent />
            </I18nProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
