import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'ROI Calculator', href: '/roi-calculator' },
  ],
  Industries: [
    { label: 'Doctors', href: '/for/doctors' },
    { label: 'Restaurants', href: '/for/restaurants' },
    { label: 'Real Estate', href: '/for/real-estate' },
    { label: 'Salons', href: '/for/salons' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Contact', href: 'mailto:hello@parichay.com' },
  ],
};

export default function CommonFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-[16px] font-semibold text-gray-900">Parichay</span>
            </Link>
            <p className="mt-4 text-[13px] text-gray-500 leading-relaxed max-w-[220px]">
              Professional digital profiles for businesses. Get discovered online.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[13px] font-semibold text-gray-900 mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-400">
            © {new Date().getFullYear()} Parichay. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
