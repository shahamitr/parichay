/**
 * Arc Component Visual Demo
 *
 * This file provides a visual demonstration page showing all Arc variations.
 * Can be used for testing and showcasing the Aonent capabilities.
 *
 * To use: Create a page route and import this component
 */

'use client';

import Arc from './Arc';

export default function ArcVisualDemo() {
  const demoColors = {
    primary: '#FF6B35',
    secondary: '#4A90E2',
    accent: '#10B981',
    purple: '#8B5CF6',
    orange: '#F97316',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm py-8 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Arc Component Visual Demo</h1>
          <p className="text-gray-600">Showcasing all variations and use cases</p>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-16 pb-16">
        {/* Section 1: Position Variations */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Position Variations</h2>

          <div className="space-y-8">
            {/* Top Arc */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-blue-50 py-16">
                <Arc position="top" color={demoColors.primary} size="medium" />
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Top Arc</h3>
                  <p className="text-gray-600 mt-2">Arc positioned at the top of section</p>
                </div>
              </div>
            </div>

            {/* Bottom Arc */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-green-50 py-16">
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Bottom Arc</h3>
                  <p className="text-gray-600 mt-2">Arc positioned at the bottom of section</p>
                </div>
                <Arc position="bottom" color={demoColors.accent} size="medium" />
              </div>
            </div>

            {/* Both Arcs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-purple-50 py-16">
                <Arc position="top" color={demoColors.purple} size="medium" />
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Both Top & Bottom Arcs</h3>
                  <p className="text-gray-600 mt-2">Fully enclosed section with arcs on both sides</p>
                </div>
                <Arc position="bottom" color={demoColors.purple} size="medium" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Size Variations */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Size Variations</h2>

          <div className="space-y-8">
            {/* Small */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-orange-50 py-12">
                <Arc position="top" color={demoColors.orange} size="small" />
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Small Arc</h3>
                  <p className="text-gray-600 mt-2">Mobile: 30px | Tablet: 60px | Desktop: 80px</p>
                  <p className="text-gray-500 text-sm mt-1">Optimized for mobile-first design</p>
                </div>
              </div>
            </div>

            {/* Medium */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-blue-50 py-12">
                <Arc position="top" color={demoColors.secondary} size="medium" />
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Medium Arc (Default)</h3>
                  <p className="text-gray-600 mt-2">Mobile: 35px | Tablet: 70px | Desktop: 90px</p>
                  <p className="text-gray-500 text-sm mt-1">Recommended for most sections</p>
                </div>
              </div>
            </div>

            {/* Large */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-green-50 py-12">
                <Arc position="top" color={demoColors.accent} size="large" />
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Large Arc</h3>
                  <p className="text-gray-600 mt-2">Mobile: 40px | Tablet: 80px | Desktop: 100px</p>
                  <p className="text-gray-500 text-sm mt-1">Best for hero sections</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Curve Intensity Variations */}
        <div>
          <h2 className="tex font-bold mb-6 text-gray-800">Curve Intensity Variations</h2>

          <div className="space-y-8">
            {/* Low Intensity */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-blue-50 py-12">
                <Arc position="top" color={demoColors.secondary} size="medium" curveIntensity={30} />
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Subtle Curve (30)</h3>
                  <p className="text-gray-600 mt-2">Gentle, barely noticeable curve</p>
                </div>
              </div>
            </div>

            {/* Medium Intensity */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-purple-50 py-12">
                <Arc position="top" color={demoColors.purple} size="medium" curveIntensity={50} />
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Moderate Curve (50 - Default)</h3>
                  <p className="text-gray-600 mt-2">Balanced, noticeable curve</p>
                </div>
              </div>
            </div>

            {/* High Intensity */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-orange-50 py-12">
                <Arc position="top" color={demoColors.orange} size="medium" curveIntensity={80} />
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Pronounced Curve (80)</h3>
                  <p className="text-gray-600 mt-2">Dramatic, highly visible curve</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Color Variations */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Color Variations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(demoColors).map(([name, color]) => (
              <div key={name} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative bg-gray-50 py-12">
                  <Arc position="top" color={color} size="medium" />
                  <div className="relative z-10 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">{name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{color}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Flipped Arc */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Flipped Arc Variation</h2>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-indigo-50 py-16">
                <Arc position="top" color="#6366F1" size="medium" flip={true} />
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Flipped Arc</h3>
                  <p className="text-gray-600 mt-2">Horizontally flipped for visual variety</p>
                </div>
                <Arc position="bottom" color="#6366F1" size="medium" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Real-world Example */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Real-world Microsite Example</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
              <div className="relative z-10 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Business</h1>
                <p className="text-xl mb-8">Your trusted partner for excellence</p>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Get Started
                </button>
              </div>
              <Arc position="bottom" color="#FFFFFF" size="large" curveIntensity={60} />
            </div>

            {/* About Section */}
            <div className="relative bg-white py-16">
              <div className="relative z-10 container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We are dedicated to providing exceptional service and quality products
                  to our valued customers. With years of experience and a commitment to
                  excellence, we're here to help you succeed.
                </p>
              </div>
              <Arc position="bottom" color={demoColors.primary} size="medium" curveIntensity={55} />
            </div>

            {/* Services Section */}
            <div className="relative bg-gray-50 py-16">
              <Arc position="top" color={demoColors.primary} size="medium" curveIntensity={55} />
              <div className="relative z-10 container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Consulting', 'Development', 'Support'].map((service) => (
                    <div key={service} className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-xl font-semibold mb-2">{service}</h3>
                      <p className="text-gray-600">Professional {service.toLowerCase()} services</p>
                    </div>
                  ))}
                </div>
              </div>
              <Arc position="bottom" color={demoColors.secondary} size="medium" curveIntensity={55} />
            </div>

            {/* Contact Section */}
            <div className="relative bg-blue-600 text-white py-16">
              <Arc position="top" color={demoColors.secondary} size="medium" curveIntensity={55} />
              <div className="relative z-10 container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
                <p className="mb-8">Ready to start your journey with us?</p>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Usage Instructions</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              To use the Arc component in your microsite sections:
            </p>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{`import Arc from '@/components/ui/Arc';

function MySection({ brand }) {
  return (
    <section className="relative bg-white py-16">
      <Arc
        position="top"
        color={brand.colorTheme.primary}
        size="medium"
        curveIntensity={55}
      />

      <div className="container mx-auto px-4">
        {/* Your content here */}
      </div>

      <Arc
        position="bottom"
        color={brand.colorTheme.primary}
        size="medium"
        curveIntensity={55}
      />
    </section>
  );
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
