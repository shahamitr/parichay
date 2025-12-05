'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface FeedbackSectionProps {
  branchId: string;
  brandId: string;
  brand?: any;
}

export default function FeedbackSection({ branchId, brandId, brand }: FeedbackSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setRating(0);
        setFeedback('');
        setName('');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted != null) {
    return (
      <section className="relative min-h-full bg-white overflow-hidden flex items-center border-b border-gray-200">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10 w-full">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-h2 font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-body text-gray-600 leading-relaxed mb-6">Your feedback has been submitted successfully.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Submit Another Feedback
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-full bg-white overflow-hidden border-b border-gray-200">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg">
            <Star className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-h2 font-bold text-gray-900 mb-3">
            Share Your Feedback
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6 border border-gray-100">
          {/* Rating */}
          <div>
            <label className="block text-small font-medium text-gray-700 mb-2 leading-normal">
              Rate your experience
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-small font-medium text-gray-700 mb-2 leading-normal">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          {/* Feedback */}
          <div>
            <label htmlFor="feedback" className="block text-small font-medium text-gray-700 mb-2 leading-normal">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about your experience..."
            />
          </div>

          {/* Submit Button - Modern Professional Design */}
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
        </div>
      </div>
    </section>
  );
}
