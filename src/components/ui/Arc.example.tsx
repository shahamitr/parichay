/**
 * Arc Component Usage Examples
 *
 * This file demonstrates various ways to use the Arc component
 * in microsite sections.
 */

import Arc from './Arc';

// Example 1: Basic usage with top arc
export function ExampleTopArc() {
  return (
    <section className="relative bg-white py-16">
      <Arc position="top" color="#FF6B35" size="medium" />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">Section with Top Arc</h2>
        <p>Content goes here...</p>
      </div>
    </section>
  );
}

// Example 2: Bottom arc with custom color
export function ExampleBottomArc() {
  return (
    <section className="relative bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">Section with Bottom Arc</h2>
        <p>Content goes here...</p>
      </div>
      <Arc position="bottom" color="#4A90E2" size="large" />
    </section>
  );
}

// Example 3: Both top and bottom arcs
export function ExampleBothArcs() {
  return (
    <section className="relative bg-white py-16">
      <Arc position="top" color="#FF6B35" size="medium" curveIntensity={60} />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">Section with Both Arcs</h2>
        <p>Content goes here...</p>
      </div>
      <Arc position="bottom" color="#FF6B35" size="medium" curveIntensity={60} />
    </section>
  );
}

// Example 4: Using with brand theming
export function ExampleWithBrandTheme({ brandColor }: { brandColor: string }) {
  return (
    <section className="relative bg-gray-50 py-16">
      <Arc position="top" color={brandColor} size="large" curveIntensity={70} />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">Branded Section</h2>
        <p>This arc uses the brand primary color</p>
      </div>
      <Arc position="bottom" color={brandColor} size="large" curveIntensity={70} />
    </section>
  );
}

// Example 5: Different sizes comparison
export function ExampleSizeComparison() {
  return (
    <div className="space-y-8">
      <section className="relative bg-blue-50 py-12">
        <Arc position="top" color="#3B82F6" size="small" />
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold">Small Arc</h3>
        </div>
      </section>

      <section className="relative bg-green-50 py-12">
        <Arc position="top" color="#10B981" size="medium" />
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold">Medium Arc</h3>
        </div>
      </section>

      <section className="relative bg-purple-50 py-12">
        <Arc position="top" color="#8B5CF6" size="large" />
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold">Large Arc</h3>
        </div>
      </section>
    </div>
  );
}

// Example 6: Flipped arcs for variety
export function ExampleFlippedArcs() {
  return (
    <section className="relative bg-white py-16">
      <Arc position="top" color="#FF6B35" size="medium" flip={true} />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">Section with Flipped Arc</h2>
        <p>The arc is horizontally flipped for visual variety</p>
      </div>
      <Arc position="bottom" color="#FF6B35" size="medium" />
    </section>
  );
}

// Example 7: Integration with microsite sections
export function ExampleMicrositeSectionWithArc({
  brand,
  content,
}: {
  brand: { colorTheme: { primary: string } };
  content: string;
}) {
  const primaryColor = brand.colorTheme.primary;

  return (
    <section className="relative bg-white py-20">
      {/* Top decorative arc */}
      <Arc position="top" color={primaryColor} size="medium" curveIntensity={55} />

      {/* Section content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">About Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{content}</p>
        </div>
      </div>

      {/* Bottom decorative arc */}
      <Arc position="bottom" color={primaryColor} size="medium" curveIntensity={55} />
    </section>
  );
}
