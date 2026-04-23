import Link from "next/link";
import ParichayLogo from "@/components/ui/ParichayLogo";

export default function CommonHeader() {
  return (
    <nav className="bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-secondary-800/20 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <ParichayLogo size="lg" animated />
          </Link>
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-4 shrink-0">
            <Link href="/search" className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-2 text-[13px] xl:text-sm font-semibold transition-all duration-300 hover:scale-105 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">Explore Network</Link>
            <Link href="/features" className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-2 text-[13px] xl:text-sm font-semibold transition-all duration-300 hover:scale-105 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">Magic Inside</Link>
            <Link href="/pricing" className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-2 text-[13px] xl:text-sm font-semibold transition-all duration-300 hover:scale-105 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">Plans & Perks</Link>
            <Link href="/clients" className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-2 text-[13px] xl:text-sm font-semibold transition-all duration-300 hover:scale-105 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">Wall of Love</Link>
            <Link href="/login" className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-2 text-[13px] xl:text-sm font-semibold transition-all duration-300 hover:scale-105 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">Member Login</Link>
            <Link href="/register" className="whitespace-nowrap bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-4 xl:px-6 py-2.5 rounded-xl text-[13px] xl:text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ml-2">
              Create My Card (Free)
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}