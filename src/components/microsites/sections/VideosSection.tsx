'use client';

interface VideosSectionProps {
  videos?: string[];
}

export default function VideosSection({ videos = [] }: VideosSectionProps) {
  const hasVideos = videos && videos.length > 0;

  return (
    <section className="relative min-h-full bg-white overflow-hidden flex items-center border-b border-gray-200">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-h2 font-bold text-gray-900 mb-3">
            Videos
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
        </div>

        {hasVideos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((videoUrl, index) => (
              <div key={index} className="aspect-video rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-2 border-orange-100">
                <iframe
                  src={videoUrl}
                  title={`Video ${index + 1}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-body text-gray-600 leading-relaxed">
              Video content will be available soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
