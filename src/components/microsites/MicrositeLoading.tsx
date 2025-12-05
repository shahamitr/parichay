'use client';

export default function MicrositeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative h-96 bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-64 h-8 bg-gray-300 rounded mx-auto"></div>
            <div className="w-48 h-6 bg-gray-300 rounded mx-auto"></div>
            <div className="w-32 h-10 bg-gray-300 rounded mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* About Section */}
        <div className="space-y-4">
          <div className="w-32 h-6 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-6">
          <div className="w-40 h-6 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <div className="w-full h-32 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                  <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-6">
          <div className="w-36 h-6 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              <div className="flex space-x-4 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-24 h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="w-full h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="w-48 h-4 bg-gray-600 rounded"></div>
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-6 h-6 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}