/**
 * Component Library Examples
 *
 * This file demonstrates the usage of the core component library.
 * Use this as a reference for implementing these components in your application.
 */

import React from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Textarea, Select } from './index';

export function ComponentLibraryExamples() {
  return (
    <div className="p-8 space-y-12 max-w-4xl mx-auto">
      {/* Button Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Button Component</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">States</h3>
            <div className="flex flex-wrap gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button leftIcon={<span>👈</span>}>With Left Icon</Button>
              <Button rightIcon={<span>👉</span>}>With Right Icon</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Card Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Card Component</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card elevation="sm">
            <CardHeader>
              <CardTitle>Small Elevation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card has a small shadow elevation.</p>
            </CardContent>
          </Card>

          <Card elevation="md" hover>
            <CardHeader>
              <CardTitle>Medium with Hover</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card has medium elevation and hover effects.</p>
            </CardContent>
          </Card>

          <Card elevation="lg">
            <CardHeader>
              <CardTitle>Large Elevation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card has a large shadow elevation.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card glassmorphism elevation="lg">
            <CardHeader>
              <CardTitle>Glassmorphism</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card uses glassmorphism effect with backdrop blur.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Form Input Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Form Components</h2>

        <Card>
          <CardContent>
            <div className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                helperText="We'll never share your email."
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error="Password must be at least 8 characters"
                fullWidth
              />

              <Input
                label="Search"
                type="text"
                placeholder="Search..."
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                fullWidth
              />

              <Textarea
                label="Message"
                placeholder="Enter your message"
                helperText="Maximum 500 characters"
                rows={4}
                fullWidth
              />

              <Select
                label="Country"
                placeholder="Select a country"
                options={[
                  { value: 'us', label: 'United States' },
                  { value: 'uk', label: 'United Kingdom' },
                  { value: 'ca', label: 'Canada' },
                  { value: 'au', label: 'Australia' },
                ]}
                fullWidth
              />

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary">Submit</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
