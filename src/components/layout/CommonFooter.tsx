import Link from 'next/link';
import ParichayLogo from '@/components/ui/ParichayLogo';
import { FadeIn, SlideIn } from '@/components/ui/AnimatedElements';

export default function CommonFooter() {
  return (
    <footer className="bg-secondary-900 border-t border-secondary-800 pt-20 pb-10 text-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -bottom-1/2 -left-1/4 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-full bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <SlideIn direction="up">
                <div className="flex items-center gap-3 mb-6">
                  <ParichayLogo size="md" />
                </div>
                <p className="text-secondary-300 dark:text-secondary-400 text-lg mb-6 max-w-md leading-relaxed">
                  Empowering modern professionals and businesses with cutting-edge digital business card solutions.
                  Create, share, and grow your brand effortlessly.
                </p>
              </SlideIn>

              <SlideIn direction="up" delay={200}>
                <div className="mb-6">
                  <div className="flex items-center gap-6 text-sm text-secondary-400 dark:text-secondary-500">
                    <span className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Always Online
                    </span>
                    <span className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                      Data Encrypted
                    </span>
                  </div>
                </div>
              </SlideIn>

              <SlideIn direction="up" delay={400}>
                <div className="flex gap-4">
                  {[
                    { icon: '📘', label: 'Facebook', color: 'hover:bg-blue-600' },
                    { icon: '🐦', label: 'Twitter', color: 'hover:bg-sky-500' },
                    { icon: '💼', label: 'LinkedIn', color: 'hover:bg-blue-700' },
                    { icon: '📷', label: 'Instagram', color: 'hover:bg-pink-600' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`w-12 h-12 bg-secondary-800/50 dark:bg-secondary-900/50 rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-secondary-700/50`}
                      aria-label={social.label}
                    >
                      <span className="text-xl">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </SlideIn>
            </div>

            {[
              {
                title: 'Product',
                links: [
                  { name: 'Features', href: '/#features' },
                  { name: 'Pricing', href: '/#pricing' },
                  { name: 'ROI Calculator', href: '/#roi' },
                  { name: 'How it Works', href: '/#transformation' }
                ]
              },
              {
                title: 'Company',
                links: [
                  { name: 'About Us', href: '/about' },
                  { name: 'Clients', href: '/clients' },
                  { name: 'Contact Us', href: '/contact' },
                  { name: 'Book Demo', href: "https://wa.me/919724153883" }
                ]
              },
              {
                title: 'Legal',
                links: [
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Terms of Service', href: '/terms' },
                  { name: 'Cookie Policy', href: '/cookies' }
                ]
              }
            ].map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <SlideIn direction="up" delay={200 + sectionIndex * 100}>
                  <h4 className="font-bold mb-6 text-xl text-white">{section.title}</h4>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </SlideIn>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={600}>
          <div className="border-t border-secondary-700/50 dark:border-secondary-800/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-secondary-400 dark:text-secondary-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} Parichay. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-secondary-400 dark:text-secondary-500">
              <a href="mailto:support@parichay.io" className="flex items-center gap-2 hover:text-white transition-colors">
                <span>📧</span>
                <span>support@parichay.io</span>
              </a>
              <a href="tel:+919054590987" className="flex items-center gap-2 hover:text-white transition-colors">
                <span>📱</span>
                <span>+91 90545 90987</span>
              </a>
              <span className="flex items-center gap-2">
                <span>🌍</span>
                <span>Made in India for the World</span>
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
