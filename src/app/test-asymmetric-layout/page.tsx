/**
 * Asymmetric Layout System Test Page
 *
 * This page demonstrates all the components from the asymmetric layout system.
 * Navigate to /test-asymmetric-layout to view this page.
 */

import React from 'react';
import {
  AsymmetricSection,
  getAlternatingPosition,
  DecorativeBackground,
  BlobShape,
  HeadingBackground,
  Section,
  Container,
  GridContainer,
  SectionSpacer,
} from '@/components/layouts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function TestAsymmetricLayoutPage() {
  const features = [
    {
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      title: 'Team Collaboration',
      subtitle: 'Work together seamlessly',
      content: 'Our platform enables teams to collaborate effectively with real-time updates, shared workspaces, and integrated communication tools.',
    },
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      title: 'Data Analytics',
      subtitle: 'Make informed decisions',
      content: 'Powerful analytics and reporting tools help you understand your business better and make data-driven decisions.',
    },
    {
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
      title: 'Secure & Reliable',
      subtitle: 'Enterprise-grade security',
      content: 'Your data is protected with industry-leading security measures and 99.9% uptime guarantee.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Decorative Background */}
      <Section background="gradient" verticalSpacing="xl">
        <DecorativeBackground variant="mesh" intensity="light">
          <div className="text-center space-y-8">
            <HeadingBackground variant="blob" color="primary">
              <h1 className="text-hero font-bold text-gray-900">
                Asymmetric Layout System
              </h1>
            </HeadingBackground>
            <p className="text-h3 text-gray-600 max-w-3xl mx-auto">
              A comprehensive demonstration of the asymmetric layout components
              with decorative backgrounds and consistent spacing
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </div>
          </div>
        </DecorativeBackground>
      </Section>

      <SectionSpacer size="lg" />

      {/* Alternating Asymmetric Sections */}
      {features.map((feature, index) => (
        <AsymmetricSection
          key={index}
          imagePosition={getAlternatingPosition(index)}
          image={feature.image}
          imageAlt={feature.title}
          title={feature.title}
          subtitle={feature.subtitle}
          background={index % 2 === 0 ? 'white' : 'gray'}
          content={
            <>
              <p>{feature.content}</p>
              <Button variant="primary" size="md" className="mt-4">
                Learn More
              </Button>
            </>
          }
        />
      ))}

      <SectionSpacer size="lg" />

      {/* Services Grid with Decorative Background */}
      <Section background="white" verticalSpacing="xl">
        <DecorativeBackground variant="blobs" intensity="medium">
          <div className="text-center space-y-8">
            <HeadingBackground variant="gradient" color="primary">
              <h2 className="text-h1 font-bold text-gray-900">
                Our Services
              </h2>
            </HeadingBackground>

            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions designed to help your business thrive
            </p>

            <GridContainer columns={3} gap="lg">
              <Card elevation="md" hover padding="lg">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mx-auto flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-h3 font-bold">Fast Deployment</h3>
                  <p className="text-gray-600">
                    Deploy your applications in minutes with our streamlined process
                  </p>
                </div>
              </Card>

              <Card elevation="md" hover padding="lg">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mx-auto flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-h3 font-bold">Secure by Default</h3>
                  <p className="text-gray-600">
                    Enterprise-grade security built into every layer
                  </p>
                </div>
              </Card>

              <Card elevation="md" hover padding="lg">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mx-auto flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-h3 font-bold">Real-time Analytics</h3>
                  <p className="text-gray-600">
                    Monitor performance with comprehensive analytics dashboard
                  </p>
                </div>
              </Card>
            </GridContainer>
          </div>
        </DecorativeBackground>
      </Section>

      <SectionSpacer size="lg" />

      {/* Custom Blob Shapes Demo */}
      <div className="relative min-h-[400px] bg-white overflow-hidden">
        <BlobShape color="purple" position="top-left" size="xl" opacity={0.15} />
        <BlobShape color="blue" position="top-right" size="lg" opacity={0.2} />
        <BlobShape color="orange" position="bottom-left" size="md" opacity={0.25} />
        <BlobShape color="pink" position="bottom-right" size="xl" opacity={0.15} />

        <Container maxWidth="6xl" verticalSpacing="xl">
          <div className="text-center space-y-6">
            <h2 className="text-h1 font-bold text-gray-900">
              Custom Decorative Elements
            </h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              This section demonstrates custom positioned blob shapes with different
              colors, sizes, and opacity levels
            </p>
          </div>
        </Container>
      </div>

      <SectionSpacer size="lg" />

      {/* Heading Background Variants */}
      <Section background="gray" verticalSpacing="xl">
        <div className="space-y-12">
          <div className="text-center">
            <HeadingBackground variant="blob" color="primary">
              <h2 className="text-h2 font-bold text-gray-900">
                Blob Background
              </h2>
            </HeadingBackground>
          </div>

          <div className="text-center">
            <HeadingBackground variant="underline" color="accent">
              <h2 className="text-h2 font-bold text-gray-900">
                Underline Background
              </h2>
            </HeadingBackground>
          </div>

          <div className="text-center">
            <HeadingBackground variant="highlight" color="primary">
              <h2 className="text-h2 font-bold text-gray-900">
                Highlight Background
              </h2>
            </HeadingBackground>
          </div>

          <div className="text-center">
            <HeadingBackground variant="gradient" color="accent">
              <h2 className="text-h2 font-bold text-gray-900">
                Gradient Background
              </h2>
            </HeadingBackground>
          </div>
        </div>
      </Section>

      <SectionSpacer size="lg" />

      {/* Call to Action */}
      <Section background="gradient" verticalSpacing="xl">
        <div className="text-center space-y-6">
          <h2 className="text-h1 font-bold text-gray-900">
            Ready to Get Started?
          </h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses already using our platform to build
            amazing digital experiences
          </p>
          <Button variant="primary" size="lg">
            Start Free Trial
          </Button>
        </div>
      </Section>

      {/* Footer Spacer */}
      <SectionSpacer size="xl" />
    </div>
  );
}
