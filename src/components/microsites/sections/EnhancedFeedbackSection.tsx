'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Camera, X, ChevronDown, ChevronUp, ThumbsUp, Quote } from 'lucide-react';

interface FeedbackItem {
  id: string;
  name: string;
  rating: number;
  feedback: string;
  photo?: string;
  date: string;
  helpful?: number;
  featured?: boolean;
}

interface EnhancedFeedbackSectionProps {
  branchId: string;
  brandId: string;
  brand?: any;
  existingReviews?: FeedbackItem[];
}

// Animated Star Rating Component
function AnimatedStarRating({
  rating,
  setRating,
  hoveredRating,
  setHoveredRating,
  size = 'large'
}: {
  rating: number;
  setRating: (r: number) => void;
  hoveredRating: number;
  setHoveredRating: (r: number) => void;
  size?: 'small' | 'large';
}) {
  const starSize = size === 'large' ? 'w-12 h-12' : 'w-5 h-5';

  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoveredRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className={`focus:outline-none transition-all duration-300 ${
              isActive ? 'scale-110' : 'scale-100'
            }`}
            style={{
              animation: isActive ? `starPop 0.3s ease ${star * 0.05}s` : 'none',
            }}
          >
            <Star
              className={`${starSize} transition-all duration-300 ${
                isActive
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        );
      })}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes starPop { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1.1); } }
      `}} />
    </div>
  );
}

// Expandable Review Card
function ReviewCard({ review, primaryColor }: { review: FeedbackItem; primaryColor: string }) {
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const isLongReview = review.feedback.length > 150;

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful(prev => prev + 1);
      setHasVoted(true);
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${
      review.featured ? 'border-yellow-300 ring-2 ring-yellow-100' : 'border-gray-100'
    }`}>
      {review.featured && (
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
            ⭐ Featured Review
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.photo ? (
            <img
              src={review.photo}
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: primaryColor }}
            >
              {review.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
              <p className="text-xs text-gray-500">{review.date}</p>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="relative">
            <Quote className="absolute -left-1 -top-1 w-4 h-4 text-gray-200" />
            <p className={`text-gray-700 leading-relaxed pl-4 ${
              !expanded && isLongReview ? 'line-clamp-3' : ''
            }`}>
              {review.feedback}
            </p>
          </div>

          {isLongReview && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-2 text-sm font-medium transition-colors"
              style={{ color: primaryColor }}
            >
              {expanded ? 'Show less' : 'Read more'}
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}

          {/* Helpful Button */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleHelpful}
              disabled={hasVoted}
              className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                hasVoted
                  ? 'text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-green-600' : ''}`} />
              Helpful ({helpful})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedFeedbackSection({
  branchId,
  brandId,
  brand,
  existingReviews = []
}: EnhancedFeedbackSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState<FeedbackItem[]>(existingReviews);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorTheme = brand?.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

  // Fetch real reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?branchId=${branchId}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          if (data.reviews && data.reviews.length > 0) {
            const formattedReviews = data.reviews.map((r: any) => ({
              id: r.id,
              name: r.reviewerName,
              rating: r.rating,
              feedback: r.comment,
              photo: r.reviewerAvatar,
              date: formatTimeAgo(new Date(r.createdAt)),
              helpful: r.helpfulCount || 0,
              featured: r.isVerified,
            }));
            setReviews(formattedReviews);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (branchId != null) {
      fetchReviews();
    } else {
      setLoadingReviews(false);
    }
  }, [branchId]);

  // Helper function to format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    return `${Math.floor(seconds / 2592000)} months ago`;
  };

  // Use fetched reviews or empty array
  const demoReviews: FeedbackItem[] = reviews;

  const featuredReviews = demoReviews.filter(r => r.featured);
  const regularReviews = demoReviews.filter(r => !r.featured);
  const displayedReviews = showAllReviews ? demoReviews : demoReviews.slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file != null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId,
          brandId,
          rating,
          feedback,
          name,
          photo,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setRating(0);
        setFeedback('');
        setName('');
        setPhoto(null);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (r: number) => {
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return labels[r] || '';
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: primaryColor }} />
          <p className="text-gray-500 max-w-md mx-auto">
            See what our customers say about us
          </p>
        </div>

        {/* Featured Reviews */}
        {featuredReviews.length > 0 && (
          <div className={`mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {featuredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} primaryColor={primaryColor} />
            ))}
          </div>
        )}

        {/* All Reviews */}
        <div className={`space-y-4 mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {displayedReviews.filter(r => !r.featured).map((review, index) => (
            <div
              key={review.id}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <ReviewCard review={review} primaryColor={primaryColor} />
            </div>
          ))}
        </div>

        {demoReviews.length > 3 && (
          <div className="text-center mb-12">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:shadow-md"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              {showAllReviews ? 'Show Less' : `View All ${demoReviews.length} Reviews`}
            </button>
          </div>
        )}

        {/* Submit Feedback Form */}
        {submitted ? (
          <div className={`bg-white rounded-3xl p-8 shadow-lg border border-green-200 text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-6">Your feedback has been submitted successfully.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              Submit Another Review
            </button>
          </div>
        ) : (
          <div className={`bg-white rounded-3xl p-8 shadow-lg border border-gray-100 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
              Share Your Experience
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  How would you rate your experience?
                </label>
                <AnimatedStarRating
                  rating={rating}
                  setRating={setRating}
                  hoveredRating={hoveredRating}
                  setHoveredRating={setHoveredRating}
                />
                {(hoveredRating || rating) > 0 && (
                  <p
                    className="mt-3 text-lg font-semibold transition-all duration-300"
                    style={{ color: primaryColor }}
                  >
                    {getRatingLabel(hoveredRating || rating)}
                  </p>
                )}
              </div>

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-shadow"
                  style={{ '--tw-ring-color': primaryColor } as any}
                  placeholder="Enter your name"
                />
              </div>

              {/* Feedback Textarea */}
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-shadow resize-none"
                  style={{ '--tw-ring-color': primaryColor } as any}
                  placeholder="Tell us about your experience..."
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a Photo (Optional)
                </label>
                {photo ? (
                  <div className="relative inline-block">
                    <img
                      src={photo}
                      alt="Preview"
                      className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Upload Photo
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="w-full py-4 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
