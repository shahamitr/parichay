// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToastHelpers } from '@/components/ui/Toast';
import {
  Star,
  MessageSquare,
  Video,
  Award,
  Tag,
  Briefcase,
  Check,
  X,
  Reply,
  Eye,
  Filter,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  reviewerName: string;
  reviewerEmail?: string;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: string;
  branch?: { id: string; name: string };
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

export default function SocialDashboardPage() {
  const { user } = useAuth();
  const { success, error, info, warning } = useToastHelpers();
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, total: 0 });

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab, filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/reviews?status=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setCounts(data.counts);
      }
    } catch (error) {
      console.toast.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action }),
      });

      if (response.ok) {
        toast.success(`Review ${action}d successfully`);
        fetchReviews();
      } else {
        toast.error(`Failed to ${action} review`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} review`);
    }
  };

  const tabs: TabConfig[] = [
    { id: 'reviews', label: 'Reviews', icon: <MessageSquare className="w-5 h-5" />, count: counts.pending },
    { id: 'video-testimonials', label: 'Video Testimonials', icon: <Video className="w-5 h-5" /> },
    { id: 'badges', label: 'Social Proof Badges', icon: <Award className="w-5 h-5" /> },
    { id: 'offers', label: 'Offers & Discounts', icon: <Tag className="w-5 h-5" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="w-5 h-5" /> },
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Social & Network Features</h1>
        <p className="text-gray-600">
          Manage reviews, testimonials, badges, offers, and portfolio items
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              {/* Filter */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="pending">Pending ({counts.pending})</option>
                    <option value="approved">Approved ({counts.approved})</option>
                    <option value="all">All ({counts.total})</option>
                  </select>
                </div>
              </div>

              {/* Reviews List */}
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No reviews found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
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
                            {review.isPublished && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Published
                              </span>
                            )}
                          </div>
                          {review.title && (
                            <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>
                          )}
                          <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            {review.branch && <span>• {review.branch.name}</span>}
                            {review.reviewerEmail && <span>• {review.reviewerEmail}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!review.isPublished && (
                            <>
                              <button
                                onClick={() => handleReviewAction(review.id, 'approve')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleReviewAction(review.id, 'reject')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Reply"
                          >
                            <Reply className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Testimonials Tab */}
          {activeTab === 'video-testimonials' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Video Testimonials</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add Video
                </button>
              </div>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No video testimonials yet</p>
                <p className="text-sm text-gray-400">
                  Add video testimonials from your satisfied customers
                </p>
              </div>
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Social Proof Badges</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add Badge
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Verified Business', 'Top Rated', 'Trusted Seller', 'Premium Partner'].map((badge) => (
                  <div
                    key={badge}
                    className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">{badge}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to add</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Offers & Discounts</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Create Offer
                </button>
              </div>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No active offers</p>
                <p className="text-sm text-gray-400">
                  Create special offers and discounts for your customers
                </p>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Portfolio Items</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No portfolio items yet</p>
                <p className="text-sm text-gray-400">
                  Showcase your best work and projects
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
