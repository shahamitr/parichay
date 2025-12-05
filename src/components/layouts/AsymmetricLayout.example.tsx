/**
 * AsymmetricLayout Example
 *
 * This file demonstrates how to use the asymmetric layout system components.
 * It shows various use cases and patterns for creating visually engaging sections.
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
} from './index';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/**
 * Example 1: Basic Asymmetric Section
 */
export function BasicAsymmetricExample() {
  return (
    <AsymmetricSection
      imagePosition="left"
      image="/images/about-us.jpg"
      imageAlt="About our company"
      title="Our Story"
      subtitle="Building the future, one step at a time"
      content={
        <>
          <p>
            We started our journey with a simple mission: to make technology accessible
            to everyone. Over the years, we've grown into a team of passionate individuals
            dedicated to creating innovative solutions.
          </p>
          <p>
            Our commitment to excellence and customer satisfaction has made us a trusted
            partner for businesses worldwide.
          </p>
          <Button variant="primary" size="lg">
            Learn More
          </Button>
        </>
      }
    />
  );
}

/**
 * Example 2: Alternating Sections
 */
export function AlternatingSectionsExample() {
  const sections = [
    {
      image: '/images/innovation.jpg',
      title: 'Innovation First',
      content: 'We believe in pushing boundaries and exploring new possibilities.',
    },
    {
      image: '/images/quality.jpg',
      title: 'Quality Assured',
      content: 'Every product we deliver meets the highest standards of excellence.',
    },
    {
      image: '/images/support.jpg',
      title: '24/7 Support',
      content: 'Our dedicated team is always here to help you succeed.',
    },
  ];

  return (
    <>
      {sections.map((section, index) => (
        <AsymmetricSection
          key={index}
          imagePosition={getAlternatingPosition(index)}
          image={section.image}
          title={section.title}
          background={index % 2 === 0 ? 'white' : 'gray'}
          content={<p>{section.content}</p>}
        />
      ))}
    </>
  );
}

/**
 * Example 3: Section with Decorative Background
 */
export function DecorativeBackgroundExample() {
  return (
    <Section background="white" verticalSpacing="xl">
      <DecorativeBackground variant="blobs" intensity="medium">
        <div className="text-center space-y-8">
          <HeadingBackground variant="gradient" color="primary">
            <h2 className="text-h1 font-bold text-gray-900">
              Our Services
            </h2>
          </HeadingBackground>

          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of services designed to help your business thrive
            in the digital age.
          </p>

          <GridContainer columns={3} gap="lg">
            <Card elevation="md" hover padding="lg">
              <h3 className="text-h3 font-bold mb-4">Web Development</h3>
              <p className="text-gray-600">
                Custom websites built with modern technologies and best practices.
              </p>
            </Card>
            <Card elevation="md" hover padding="lg">
              <h3 className="text-h3 font-bold mb-4">Mobile Apps</h3>
              <p className="text-gray-600">
                Native and cross-platform mobile applications for iOS and Android.
              </p>
            </Card>
            <Card elevation="md" hover padding="lg">
              <h3 className="text-h3 font-bold mb-4">Cloud Solutions</h3>
              <p className="text-gray-600">
                Scalable cloud infrastructure and deployment solutions.
              </p>
            </Card>
          </GridContainer>
        </div>
      </DecorativeBackground>
    </Section>
  );
}

/**
 * Example 4: Custom Blob Shapes
 */
export function CustomBlobShapesExample() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Custom positioned blobs */}
      <BlobShape color="purple" position="top-left" size="xl" opacity={0.15} />
      <BlobShape color="blue" position="top-right" size="lg" opacity={0.2} />
      <BlobShape color="orange" position="bottom-left" size="md" opacity={0.25} />
      <BlobShape color="pink" position="bottom-right" size="xl" opacity={0.15} />

      <Container maxWidth="6xl" verticalSpacing="xl">
        <div className="text-center space-y-6">
          <h1 className="text-hero font-bold text-gray-900">
            Welcome to Our Platform
          </h1>
          <p className="text-h3 text-gray-600 max-w-3xl mx-auto">
            Experience the power of modern design with our asymmetric layout system
          </p>
        </div>
      </Container>
    </div>
  );
}

/**
 * Example 5: Complete Page Layout
 */
export function CompletePageExample() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Decorative Background */}
      <Section background="gradient" verticalSpacing="xl">
        <DecorativeBackground variant="mesh" intensity="light">
          <div className="text-center space-y-8">
            <HeadingBackground variant="blob" color="primary">
              <h1 className="text-hero font-bold text-gray-900">
                Transform Your Business
              </h1>
            </HeadingBackground>
            <p className="text-h3 text-gray-600 max-w-3xl mx-auto">
              Discover innovative solutions that drive growth and success
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </DecorativeBackground>
      </Section>

      <SectionSpacer size="lg" />

      {/* Asymmetric Content Sections */}
      <AsymmetricSection
        imagePosition="left"
        image="/images/feature-1.jpg"
        title="Powerful Features"
        subtitle="Everything you need to succeed"
        background="white"
        content={
          <>
            <p>
              Our platform provides all the tools and features you need to build,
              launch, and grow your business online.
            </p>
            <ul className="space-y-2 mt-4">
              <li>✓ Advanced analytics and reporting</li>
              <li>✓ Seamless integrations</li>
              <li>✓ 24/7 customer support</li>
            </ul>
          </>
        }
      />

      <AsymmetricSection
        imagePosition="right"
        image="/images/feature-2.jpg"
        title="Built for Scale"
        subtitle="Grow without limits"
        background="gray"
        content={
          <p>
            Whether you're a startup or an enterprise, our infrastructure scales
            with your needs. Handle millions of users without breaking a sweat.
          </p>
        }
      />

      <SectionSpacer size="lg" />

      {/* Call to Action Section */}
      <Section background="gradient" verticalSpacing="xl">
        <div className="text-center space-y-6">
          <h2 className="text-h1 font-bold text-gray-900">
            Ready to Get Started?
          </h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses already using our platform
          </p>
          <Button variant="primary" size="lg">
            Start Free Trial
          </Button>
        </div>
      </Section>
    </div>
  );
}

/**
 * Example 6: Responsive Grid with Container
 */
export function ResponsiveGridExample() {
  return (
    <Section background="white" verticalSpacing="xl">
      <div className="text-center mb-12">
        <h2 className="text-h1 font-bold text-gray-900 mb-4">
          Why Choose Us
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
      </div>

      <GridContainer columns={4} gap="lg">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} elevation="md" hover padding="lg">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mx-auto flex items-center justify-center">
                <span className="text-2xl text-white font-bold">{item}</span>
              </div>
              <h3 className="text-h4 font-bold">Feature {item}</h3>
              <p className="text-gray-600">
                Description of feature {item} and its benefits
              </p>
            </div>
          </Card>
        ))}
      </GridContainer>
    </Section>
  );
}
