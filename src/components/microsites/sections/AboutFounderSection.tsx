'use client';

import { useState, useEffect, useRef } from 'react';
import { Linkedin, Twitter, Instagram, Mail, Quote, Award, Briefcase, GraduationCap } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';
import { getImageWithFallback } from '@/lib/placeholder-utils';

interface AboutFounderSectionProps {
  brand: Brand;
  branch: Branch;
  config?: {
    name?: string;
    title?: string;
    photo?: string;
    bio?: string;
    achievements?: string[];
    education?: string;
    experience?: string;
    quote?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      email?: string;
    };
  };
}

export default function AboutFounderSection({ brand, branch, config }: AboutFounderSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

  // Default config if not provided
  const founderConfig = config || {
    name: 'John Doe',
    title: 'Founder & CEO',
    bio: 'With over 15 years of experience in the industry, our founder has built this company from the ground up with a vision to deliver excellence and innovation to every customer.',
    achievements: [
      'Industry Leader Award 2023',
      'Best Entrepreneur Under 40',
      'Innovation Excellence Award',
    ],
    education: 'MBA from IIM Ahmedabad',
    experience: '15+ Years in Industry',
    quote: 'Our mission is to transform every customer interaction into a memorable experience.',
  };

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

  const socialLinks = [
    { icon: Linkedin, href: founderConfig.socialLinks?.linkedin, color: '#0A66C2' },
    { icon: Twitter, href: founderConfig.socialLinks?.twitter, color: '#1DA1F2' },
    { icon: Instagram, href: founderConfig.socialLinks?.instagram, color: '#E4405F' },
    { icon: Mail, href: founderConfig.socialLinks?.email ? `mailto:${founderConfig.socialLinks.email}` : null, color: '#EA4335' },
  ].filter(link => link.href);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Founder
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: primaryColor }} />
          <p className="text-gray-500 max-w-md mx-auto">
            The visionary behind our success story
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Photo & Social Links */}
          <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative">
              {/* Main Photo */}
              <div className="relative z-10">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={founderConfig.photo || getImageWithFallback(undefined, 'avatar', founderConfig.name || 'Founder')}
                    alt={founderConfig.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Decorative Elements */}
                <div
                  className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl -z-10"
                  style={{ backgroundColor: `${primaryColor}20` }}
                />
                <div
                  className="absolute -top-4 -left-4 w-24 h-24 rounded-full -z-10"
                  style={{ backgroundColor: `${primaryColor}15` }}
                />
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex justify-center gap-3 mt-6">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        style={{ backgroundColor: `${link.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: link.color }} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Name & Title */}
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {founderConfig.name}
              </h3>
              <p className="text-lg font-medium" style={{ color: primaryColor }}>
                {founderConfig.title}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mb-8">
              {founderConfig.experience && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                  <Briefcase className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{founderConfig.experience}</span>
                </div>
              )}
              {founderConfig.education && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                  <GraduationCap className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gr-700">{founderConfig.education}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {founderConfig.bio}
            </p>

            {/* Quote */}
            {founderConfig.quote && (
              <div className="relative bg-gray-50 rounded-2xl p-6 mb-8">
                <Quote className="absolute top-4 left-4 w-8 h-8 text-gray-200" />
                <p className="text-gray-700 italic text-lg pl-8 leading-relaxed">
                  "{founderConfig.quote}"
                </p>
              </div>
            )}

            {/* Achievements */}
            {founderConfig.achievements && founderConfig.achievements.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: primaryColor }} />
                  Achievements
                </h4>
                <div className="space-y-3">
                  {founderConfig.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <span className="text-sm font-bold" style={{ color: primaryColor }}>
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
