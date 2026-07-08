import Link from 'next/link';

const links = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Templates', href: '/demo/industries' },
  ],
  Industries: [
    { label: 'Doctors', href: '/demo-healthcare-professionals/main' },
    { label: 'Restaurants', href: '/demo-restaurants-cafes/main' },
    { label: 'Salons', href: '/demo-creatives-designers/main' },
    { label: 'All Industries', href: '/demo/industries' },
  ],
  Support: [
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'API Docs', href: '/api-doc' },
    { label: 'Blog', href: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
};

export default function FooterSection() {
  return (
    <footer className="border-t border-gray-100 bg-[#FAFAFC]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="text-[16px] font-semibold text-[#0F172A]">Parichay</span>
            </Link>
            <p className="mt-4 text-[13px] text-gray-500 leading-relaxed max-w-[200px]">
              Your Digital Identity Starts Here.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[13px] text-gray-600 hover:text-[#0F172A] transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-gray-400">© {new Date().getFullYear()} Parichay. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[12px] text-gray-400">
            <span>Made in India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
