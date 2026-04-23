'use client';

import { useState, useEffect } from 'react';
import { Play, X, User, Quote, Video, Loader2 } from 'lucide-react';

interface VideoTestimonial {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  customerName: string;
  customerTitle?: string;
  customerAvatar?: string;
  transcript?: string;
  duration?: number;
  isPublished: boolean;
  isFeatured: boolean;
}

interface VideoTestimonialsDisplayProps {
  branchId: string;
}

export default function VideoTestimonialsDisplay({ branchId }: VideoTestimonialsDisplayProps) {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, [branchId]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`/api/video-testimonials?branchId=${branchId}&publishedOnly=true`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error('Failed to fetch video testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    return url;
  };

  const getThumbnail = (testimonial: VideoTestimonial) => {
    if (testimonial.thumbnailUrl) return testimonial.thumbnailUrl;

    // YouTube thumbnail
    const youtubeMatch = testimonial.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }

    return null;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const trackView = async (testimonialId: string) => {
    try {
      await fetch(`/api/video-testimonials/${testimonialId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incrementView: true }),
      });
    } catch (err) {
      console.error('Failed to track view:', err);
    }
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  const featuredTestimonials = testimonials.filter(t => t.isFeatured);
  const otherTestimonials = testimonials.filter(t => !t.isFeatured);

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-4">
            <Video className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-400">Video Testimonials</span>
          </div>
          <h2 id="video-testimonials-heading" className="text-3xl font-bold text-white mb-3">
            What Our Clients Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear directly from our satisfied customers about their experience
          </p>
        </div>

        {/* Featured Videos */}
        {featuredTestimonials.length > 0 && (
          <div className="mb-8">
            {featuredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative rounded-2xl overflow-hidden bg-gray-800 cursor-pointer group"
                onClick={() => {
                  setActiveVideo(testimonial);
                  trackView(testimonial.id);
                }}
              >
                <div className="aspect-video relative">
                  {getThumbnail(testimonial) ? (
                    <img
                      src={getThumbnail(testimonial)!}
                      alt={testimonial.customerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Video className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-gray-900 ml-1" />
                    </div>
                  </div>
                  {testimonial.duration && (
                    <span className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                      {formatDuration(testimonial.duration)}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    {testimonial.customerAvatar ? (
                      <img
                        src={testimonial.customerAvatar}
                        alt={testimonial.customerName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-7 h-7 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{testimonial.customerName}</h3>
                      {testimonial.customerTitle && (
                        <p className="text-gray-400 text-sm">{testimonial.customerTitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Videos Grid */}
        {otherTestimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={() => {
                  setActiveVideo(testimonial);
                  trackView(testimonial.id);
                }}
              >
                <div className="aspect-video relative">
                  {getThumbnail(testimonial) ? (
                    <img
                      src={getThumbnail(testimonial)!}
                      alt={testimonial.customerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-gray-900 ml-0.5" />
                    </div>
                  </div>
                  {testimonial.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      {formatDuration(testimonial.duration)}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {testimonial.customerAvatar ? (
                      <img
                        src={testimonial.customerAvatar}
                        alt={testimonial.customerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-white text-sm">{testimonial.customerName}</h4>
                      {testimonial.customerTitle && (
                        <p className="text-gray-400 text-xs">{testimonial.customerTitle}</p>
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
                <h3 className="text-xl font-semibold text-white">{activeVideo.customerName}</h3>
                {activeVideo.customerTitle && (
                  <p className="text-gray-400">{activeVideo.customerTitle}</p>
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
    </section>
  );
}
