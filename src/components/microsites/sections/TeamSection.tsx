'use client';

import { Users, Mail, Phone, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';
import { getImageWithFallback } from '@/lib/placeholder-utils';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  email?: string;
  phone?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface TeamConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  members: TeamMember[];
  layout?: 'grid' | 'list';
}

interface TeamSectionProps {
  config: TeamConfig;
  brand: Brand;
  branch: Branch;
}

export default function TeamSection({ config, brand, branch }: TeamSectionProps) {
  if (!config.enabled || !config.members || config.members.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <Users className="w-5 h-5" />
            <span className="font-semibold">Our Team</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {config.title || 'Meet Our Team'}
          </h2>
          {config.subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto">{config.subtitle}</p>
          )}
        </div>

        {/* Team Grid */}
        <div className={`grid gap-8 ${
          config.layout === 'list'
            ? 'grid-cols-1'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {config.members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Photo */}
              <div className="relative h-64 bg-gray-200">
                <img
                  src={member.photo || getImageWithFallback(undefined, 'avatar', member.name)}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-brand-primary font-medium mb-3">{member.role}</p>

                {member.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
                )}

                {/* Contact */}
                <div className="space-y-2 mb-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-primary"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-primary"
                    >
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {member.social && (
                  <div className="flex gap-3">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-400 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {member.social.facebook && (
                      <a
                        href={member.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
