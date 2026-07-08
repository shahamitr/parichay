import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Star, ExternalLink, UserPlus } from 'lucide-react';

interface PageProps {
  params: Promise<{ city: string; category: string }>;
}

interface DirectoryResult {
  id: string;
  name: string;
  branchName: string;
  slug: string;
  branchSlug: string;
  logo: string | null;
  tagline: string | null;
  city: string;
  state: string;
  businessType: string;
  categories: string[];
  isVerified: boolean;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  url: string;
}

async function fetchDirectoryResults(city: string, category: string): Promise<DirectoryResult[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(
      `${baseUrl}/api/search/directory?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}&limit=24`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => capitalize(word))
    .join(' ');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, category } = await params;
  const cityName = formatSlug(city);
  const categoryName = formatSlug(category);

  const title = `Best ${categoryName} in ${cityName} | Parichay Business Directory`;
  const description = `Find top-rated ${categoryName.toLowerCase()} services in ${cityName}. View profiles, ratings, contact info, and book appointments. Verified businesses on Parichay.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://parichay.io/find/${city}/${category}`,
    },
    alternates: {
      canonical: `https://parichay.io/find/${city}/${category}`,
    },
  };
}

export default async function CityCategory({ params }: PageProps) {
  const { city, category } = await params;
  const cityName = formatSlug(city);
  const categoryName = formatSlug(category);

  const results = await fetchDirectoryResults(city, category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <nav className="text-[12px] text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/search" className="hover:text-gray-600">Directory</Link>
            <span className="mx-2">/</span>
            <Link href={`/find/${city}/${category}`} className="text-gray-600">{cityName}</Link>
          </nav>
          <h1 className="text-[24px] sm:text-[30px] font-semibold text-gray-900 tracking-[-0.02em]">
            Best {categoryName} in {cityName}
          </h1>
          <p className="mt-2 text-[14px] text-gray-500">
            {results.length > 0
              ? `${results.length} verified ${categoryName.toLowerCase()} businesses found in ${cityName}`
              : `Discover ${categoryName.toLowerCase()} services in ${cityName}`}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {results.length > 0 ? (
          <>
            {/* Results grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((business) => (
                <Link
                  key={business.id}
                  href={business.url}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {business.logo ? (
                        <img
                          src={business.logo}
                          alt={business.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[16px] font-semibold text-gray-400">
                          {business.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-[14px] font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                          {business.name}
                        </h2>
                        {business.isVerified && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                            Verified
                          </span>
                        )}
                      </div>
                      {business.tagline && (
                        <p className="text-[12px] text-gray-500 mt-0.5 truncate">{business.tagline}</p>
                      )}
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-50">
                    {business.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-[12px] font-medium text-gray-700">{business.rating}</span>
                        <span className="text-[11px] text-gray-400">({business.reviewCount})</span>
                      </div>
                    )}
                    {business.city && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {business.city}
                      </div>
                    )}
                    {business.isOpen && (
                      <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full ml-auto">
                        Open Now
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-[18px] font-semibold text-gray-900">
                Are you a {categoryName.toLowerCase()} in {cityName}?
              </h2>
              <p className="text-[14px] text-gray-500 mt-2 max-w-md mx-auto">
                Register your business on Parichay to get found by customers looking for {categoryName.toLowerCase()} services.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-[14px] font-medium rounded-xl transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Register Your Business
              </Link>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <MapPin className="w-7 h-7 text-gray-300" />
            </div>
            <h2 className="text-[18px] font-semibold text-gray-900">
              Be the first {categoryName.toLowerCase()} in {cityName}
            </h2>
            <p className="text-[14px] text-gray-500 mt-2 max-w-md mx-auto">
              No {categoryName.toLowerCase()} businesses listed in {cityName} yet.
              Register now and be the first to appear when customers search.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-[14px] font-medium rounded-xl transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Register Your Business
            </Link>

            {/* Suggested searches */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-[12px] font-medium text-gray-400 mb-3">Popular searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['dentist', 'salon', 'plumber', 'electrician', 'restaurant', 'gym'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/find/${city}/${cat}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[12px] text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                  >
                    {capitalize(cat)} in {cityName}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
