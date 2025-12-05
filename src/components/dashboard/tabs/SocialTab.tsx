'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Check, X, Reply, ThumbsUp } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  reviewerName: string;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: string;
  branch?: { name: string };
}

interface SocialTabProps {
  brandId?: string | null;
  branchId?: string | null;
}

export default function SocialTab({ brandId, branchId }: SocialTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all');

  useEffect(() => {
    fetchReviews();
  }, [brandId, branchId, filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (brandId) params.append('brandId', brandId);
      if (filter !== 'all') params.append('status', filter);

      const response = await fetch(`/api/admin/reviews?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action }),
      });
      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading != null) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <p className="text-2xl font-bold text-yellow-700">{avgRating}</p>
          </div>
          <p className="text-sm text-yellow-600">Avg Rating</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-2xl font-bold text-blue-700">{reviews.length}</p>
          <p className="text-sm text-blue-600">Total Reviews</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-700">
            {reviews.filter((r) => r.isPublished).length}
          </p>
          <p className="text-sm text-green-600">Published</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-2xl font-bold text-orange-700">
            {reviews.filter((r) => !r.isPublished).length}
          </p>
          <p className="text-sm text-orange-600">Pending</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'published'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">{review.reviewerName}</span>
                    {renderStars(review.rating)}
                    {review.isVerified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                    {review.isPublished ? (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>
                  )}
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    {review.branch && <span>• {review.branch.name}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!review.isPublished && (
                    <>
                      <button
                        onClick={() => handleAction(review.id, 'approve')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction(review.id, 'reject')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Reply">
                    <Reply className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">Reviews will appear here when customers submit them</p>
        </div>
      )}
    </div>
  );
}
