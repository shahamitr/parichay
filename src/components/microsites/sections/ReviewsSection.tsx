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
                  ? 'fill-warning-400 text-warning-400 dark:fill-warning-500 dark:text-warning-500'
                  : 'fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="py-12 px-4 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 id="reviews-heading" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{averageRating}</span>
              <span className="text-neutral-500 dark:text-neutral-400">({reviews.length} reviews)</span>
            </div>
          )}
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4 mb-6">
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700"
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
                      <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{review.authorName}</h4>
                        {review.authorCompany && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">{review.authorCompany}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        {review.verified && (
                          <span className="text-xs bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {review.title && (
                      <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">{review.title}</h5>
                    )}
                    <p className="text-neutral-600 dark:text-neutral-300 mb-3">{review.content}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-400 dark:text-neutral-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                      <button className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                    {review.response && (
                      <div className="mt-4 pl-4 border-l-2 border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 rounded-r-lg p-3">
                        <p className="text-sm font-medium text-primary-900 dark:text-primary-200 mb-1">Response from owner</p>
                        <p className="text-sm text-primary-800 dark:text-primary-300">{review.response.content}</p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
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
          <div className="text-center py-8 bg-white dark:bg-neutral-800 rounded-xl">
            <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400">No reviews yet. Be the first to leave a review!</p>
          </div>
        )}

        {/* Show More Button */}
        {reviews.length > (config.displayCount || 3) && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-3 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center justify-center gap-2"
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
                className="w-full py-4 bg-primary-600 dark:bg-primary-700 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium"
              >
                Write a Review
              </button>
            ) : submitted ? (
              <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-700 rounded-xl p-6 text-center">
                <p className="text-success-700 dark:text-success-300 font-medium">
                  Thank you for your review! It will be visible after moderation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Write a Review</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Rating</label>
                    {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Title (Optional)</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                      placeholder="Great experience!"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Your Review</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
