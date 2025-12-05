'use client';

import { useState } from 'react';
import { Play, X, User, Quote } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';
import { VideoTestimonialsSection as VideoTestimonialsConfig, VideoTestimonial } from '@/types/microsite';

interface VideoTestimonialsSectionProps {
  config: VideoTestimonialsConfig;
  brand: Brand;
  branch: Branch;
}

export default function VideoTestimonialsSection({ config, brand, branch }: VideoTestimonialsSectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  if (!config.enabled || !config.videos || config.videos.length === 0) return null;

  const getEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch != null) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch != null) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    return url;
  };

  const getThumbnail = (video: VideoTestimonial) => {
    if (video.thumbnailUrl) return video.thumbnailUrl;

    // YouTube thumbnail
    const youtubeMatch = video.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch != null) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }

    return '/images/video-placeholder.jpg';
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const featuredVideos = config.videos.filter(v => v.featured);
  const otherVideos = config.videos.filter(v => !v.featured);

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="video-testimonials-heading" className="text-3xl font-bold text-white mb-3">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear directly from our satisfied customers about their experience
          </p>
        </div>

        {/* Featured Videos */}
        {featuredVideos.length > 0 && (
          <div className="mb-8">
            {featuredVideos.map((video) => (
              <div
                key={video.id}
                className="relative rounded-2xl overflow-hidden bg-gray-800 cursor-pointer group"
                onClick={() => setActiveVideo(video)}
              >
                <div className="aspect-video relative">
                  <img
                    src={getThumbnail(video)}
                    alt={video.authorName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-gray-900 ml-1" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    {video.authorPhoto ? (
                      <img
                        src={video.authorPhoto}
                        alt={video.authorName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-7 h-7 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{video.authorName}</h3>
                      {(video.authorRole || video.authorCompany) && (
                        <p className="text-gray-400 text-sm">
                          {video.authorRole}{video.authorRole && video.authorCompany && ' at '}{video.authorCompany}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Videos Grid */}
        {otherVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherVideos.map((video) => (
              <div
                key={video.id}
                className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={() => setActiveVideo(video)}
              >
                <div className="aspect-video relative">
                  <img
                    src={getThumbnail(video)}
                    alt={video.authorName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-gray-900 ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      {formatDuration(video.duration)}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {video.authorPhoto ? (
                      <img
                        src={video.authorPhoto}
                        alt={video.authorName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-white text-sm">{video.authorName}</h4>
                      {video.authorCompany && (
                        <p className="text-gray-400 text-xs">{video.authorCompany}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={() => setActiveVideo(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <div
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={getEmbedUrl(activeVideo.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-white">{activeVideo.authorName}</h3>
                {(activeVideo.authorRole || activeVideo.authorCompany) && (
                  <p className="text-gray-400">
                    {activeVideo.authorRole}{activeVideo.authorRole && activeVideo.authorCompany && ' at '}{activeVideo.authorCompany}
                  </p>
                )}
                {activeVideo.transcript && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left max-h-32 overflow-y-auto">
                    <Quote className="w-5 h-5 text-gray-500 mb-2" />
                    <p className="text-gray-300 text-sm italic">{activeVideo.transcript}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
