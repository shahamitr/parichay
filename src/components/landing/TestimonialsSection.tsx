'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      company: 'Kumar Enterprises',
      image: '👨‍💼',
      rating: 5,
      text: 'Parichay transformed how I network. I can share my business details instantly at events, and the analytics help me track which connections are most engaged.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Priya Sharma',
      role: 'Event Planner',
      company: 'Elegant Events',
      image: '👩‍💼',
      rating: 5,
      text: 'The industry-specific templates are perfect! My digital card showcases my event portfolio beautifully. Clients love the professional look and easy sharing.',
      color: 'from-pink-500 to-pink-600',
    },
    {
      name: 'Amit Patel',
      role: 'Freelance Designer',
      company: 'Creative Studio',
      image: '🎨',
      rating: 5,
      text: 'As a designer, I needed something that reflects my creativity. The customization options are endless, and my clients are impressed every time I share my card.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'Dr. Meera Reddy',
      role: 'Educational Director',
      company: 'Bright Future Academy',
      image: '👩‍🏫',
      rating: 5,
      text: 'We use Parichay for all our faculty members. It is professional, easy to update, and parents appreciate having all contact information in one place.',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Vikram Singh',
      role: 'Corporate Executive',
      company: 'Tech Solutions Inc',
      image: '👔',
      rating: 5,
      text: 'The QR code feature is a game-changer at conferences. People scan and have all my details instantly. No more fumbling with paper cards!',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      name: 'Sneha Gupta',
      role: 'Marketing Consultant',
      company: 'Growth Strategies',
      image: '💼',
      rating: 5,
      text: 'The lead capture feature helps me collect inquiries directly from my card. It is like having a mini landing page that works 24/7. Highly recommend!',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Professionals Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied users who have transformed their networking game
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-gray-900" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6 font-medium">Trusted by leading companies and professionals</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">COMPANY A</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY B</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY C</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY D</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY E</div>
          </div>
        </div>
      </div>
    </section>
  );
}
