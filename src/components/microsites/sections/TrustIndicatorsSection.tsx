'use client';

import { Brand, Branch } from '@/generated/prisma';
import { TrustIndicatorsSection as TrustIndicatorsConfig } from '@/types/microsite';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Shield, CheckCircle, Users } from 'lucide-react';
import { getImageWithFallback } from '@/lib/placeholder-utils';

interface TrustIndicatorsSectionProps {
  config: TrustIndicatorsConfig;
  brand: Brand;
  branch: Branch;
}

export default function TrustIndicatorsSection({
  config,
  brand,
  branch,
}: TrustIndicatorsSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  if (!config.enabled) {
    return null;
  }

  const hasCertifications = config.certifications && config.certifications.length > 0;
  const hasPartners = config.partners && config.partners.length > 0;

  if (!hasCertifications && !hasPartners) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-full bg-gradient-to-b from-gray-50 to-white overflow-hidden border-b border-gray-200"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-h2 font-bold text-gray-900 mb-3">
            Trusted & Certified
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
          <p className="text-body text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            Our commitment to excellence is recognized by industry leaders
          </p>
        </motion.div>

        {/* Certifications Section */}
        {hasCertifications && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-blue-600" />
              <h3 className="text-h3 font-bold text-gray-900">
                Certifications & Awards
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="group"
                >
                  <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full flex flex-col items-center text-center">
                    {/* Badge/Seal Design */}
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {cert.logo ? (
                          <img
                            src={getImageWithFallback(cert.logo, 'logo', cert.name)}
                            alt={cert.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <Award className="w-10 h-10 text-blue-600" />
                        )}
                      </div>
                      {/* Verified checkmark */}
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Certification Name */}
                    <h4 className="text-base font-bold text-gray-900 mb-2">
                      {cert.name}
                    </h4>

                    {/* Description */}
                    {cert.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {cert.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Partners Section */}
        {hasPartners && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-green-600" />
              <h3 className="text-h3 font-bold text-gray-900">
                Our Partners
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
                {config.partners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="group flex flex-col items-center"
                  >
                    <div className="relative w-full aspect-square max-w-[120px] rounded-xl bg-gray-50 p-4 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 border border-gray-200">
                      {partner.logo ? (
                        <img
                          src={getImageWithFallback(partner.logo, 'logo', partner.name)}
                          alt={partner.name}
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-xs font-semibold text-gray-700">
                            {partner.name}
                          </p>
                        </div>
                      )}
                    </div>
                    {partner.logo && (
                      <p className="text-xs font-medium text-gray-600 mt-2 text-center">
                        {partner.name}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Trust Statement */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-full border border-blue-100">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-base font-medium text-gray-700">
              Verified and trusted by industry standards
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
