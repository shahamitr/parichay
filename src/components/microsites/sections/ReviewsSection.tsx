'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, User, ChevronDown, Send } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';
import { ReviewsSection as ReviewsConfig, PublicReview } from '@/types/microsite';

interface ReviewsSectionProps {
  config: ReviewsConfig;
  brand: Brand;
  branch: Branch;
}

export default function ReviewsSection({ config, brand, branch }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<PublicReview[]>(config.reviews || []);
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [formData, setFormData] = useState({
    authorName: '',
    rating: 5,
    title: '',
    content: '',
  });

  useEffect(() => {
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      setAverageRating(Math.round(avg * 10) / 10);
    }
  }, [reviews]);

  if (!config.enabled) return null;

  const displayedReviews = showAll ? reviews : reviews.slice(0, config.displayCount || 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: branch.id,
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ authorName: '', rating: 5, title: '', content: '' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 id="reviews-heading" className="text-2xl font-bold text-gray-900 mb-2">
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-xl font-semibold text-gray-900">{averageRating}</span>
              <span className="text-gray-500">({reviews.length} reviews)</span>
            </div>
          )}
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4 mb-6">
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {review.authorPhoto ? (
                      <img
                        src={review.authorPhoto}
                        alt={review.authorName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.authorName}</h4>
                        {review.authorCompany && (
                          <p className="text-sm text-gray-500">{review.authorCompany}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {review.title && (
                      <h5 className="font-medium text-gray-900 mb-1">{review.title}</h5>
                    )}
                    <p className="text-gray-600 mb-3">{review.content}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                    {review.response && (
                      <div className="mt-4 pl-4 border-l-2 border-blue-200 bg-blue-50 rounded-r-lg p-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">Response from owner</p>
                        <p className="text-sm text-blue-800">{review.response.content}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {new Date(review.response.date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
          </div>
        )}

        {/* Show More Button */}
        {reviews.length > (config.displayCount || 3) && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
          >
            <span>Show All Reviews ({reviews.length})</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        )}

        {/* Write Review Button/Form */}
        {config.allowPublicReviews && (
          <div className="mt-8">
            {!showForm && !submitted ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Write a Review
              </button>
            ) : submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-green-700 font-medium">
                  Thank you for your review! It will be visible after moderation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Great experience!"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
