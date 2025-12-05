/**
 * Color Contrast Verification
 *
 * Utilities for verifying WCAG AA/AAA color contrast compliance.
 * Requirements: 10.3 - WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
 */

import { designTokens } from '@/config/design-tokens';
import { getContrastRatio, meetsWCAGAA, meetsWCAGAAA } from './accessibility-utils';

export interface ContrastTestResult {
  foreground: string;
  background: string;
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  meetsAALarge: boolean;
  meetsAAALarge: boolean;
  description: string;
}

/**
 * Test a color combination for WCAG compliance
 */
export function testColorContrast(
  foreground: string,
  background: string,
  description: string
): ContrastTestResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    foreground,
    background,
    ratio,
    meetsAA: meetsWCAGAA(foreground, background, false),
    meetsAAA: meetsWCAGAAA(foreground, background, false),
    meetsAALarge: meetsWCAGAA(foreground, background, true),
    meetsAAALarge: meetsWCAGAAA(foreground, background, true),
    description,
  };
}

/**
 * Verify all design token color combinations
 */
export function verifyDesignTokenContrast(): ContrastTestResult[] {
  const results: ContrastTestResult[] = [];

  // Test primary colors on white background
  results.push(
    testColorContrast(
      designTokens.colors.primary[500],
      '#ffffff',
      'Primary 500 on White'
    )
  );

  results.push(
    testColorContrast(
      designTokens.colors.primary[600],
      '#ffffff',
      'Primary 600 on White'
    )
  );

  results.push(
    testColorContrast(
      designTokens.colors.primary[700],
      '#ffffff',
      'Primary 700 on White'
    )
  );

  // Test accent colors on white background
  results.push(
    testColorContrast(
      designTokens.colors.accent[500],
      '#ffffff',
      'Accent 500 on White'
    )
  );

  results.push(
    testColorContrast(
      designTokens.colors.accent[700],
      '#ffffff',
      'Accent 700 on White'
    )
  );

  // Test neutral colors on white background
  results.push(
    testColorContrast(
      designTokens.colors.neutral[700],
      '#ffffff',
      'Neutral 700 on White (Body Text)'
    )
  );

  results.push(
    testColorContrast(
      designTokens.colors.neutral[900],
      '#ffffff',
      'Neutral 900 on White (Headings)'
    )
  );

  results.push(
    testColorContrast(
      designTokens.colors.neutral[500],
      '#ffffff',
      'Neutral 500 on White (Secondary Text)'
    )
  );

  // Test white text on primary colors
  results.push(
    testColorContrast(
      '#ffffff',
      designTokens.colors.primary[500],
      'White on Primary 500 (Buttons)'
    )
  );

  results.push(
    testColorContrast(
      '#ffffff',
      designTokens.colors.primary[600],
      'White on Primary 600'
    )
  );

  // Test white text on accent colors
  results.push(
    testColorContrast(
      '#ffffff',
      designTokens.colors.accent[500],
      'White on Accent 500'
    )
  );

  results.push(
    testColorContrast(
      '#ffffff',
      designTokens.colors.accent[700],
      'White on Accent 700'
    )
  );

  // Test dark mode combinations
  results.push(
    testColorContrast(
      '#fafafa',
      designTokens.colors.neutral[900],
      'Light Text on Dark Background (Dark Mode)'
    )
  );

  results.push(
    testColorContrast(
      '#d4d4d4',
      designTokens.colors.neutral[900],
      'Secondary Text on Dark Background (Dark Mode)'
    )
  );

  results.push(
    testColorContrast(
      '#a3a3a3',
      designTokens.colors.neutral[900],
      'Tertiary Text on Dark Background (Dark Mode)'
    )
  );

  // Test error, success, warning colors
  results.push(
    testColorContrast(
      designTokens.colors.error[500],
      '#ffffff',
      'Error 500 on White'
    )
  );

  results.push(
    testColorContrast(
      designTokens.colors.success[600],
      '#ffffff',
      'Success 600 on White'
    )
  );

  results.push(
    testColorContrast(
      designTokens.colors.warning[600],
      '#ffffff',
      'Warning 600 on White'
    )
  );

  // Test link colors
  results.push(
    testColorContrast(
      designTokens.colors.primary[500],
      '#ffffff',
      'Link Color (Primary 500) on White'
    )
  );

  return results;
}

/**
 * Get a summary of contrast verification results
 */
export function getContrastSummary(results: ContrastTestResult[]): {
  total: number;
  passing: number;
  failing: number;
  passRate: number;
} {
  const total = results.length;
  const passing = results.filter(r => r.meetsAA).length;
  const failing = total - passing;
  const passRate = (passing / total) * 100;

  return {
    total,
    passing,
    failing,
    passRate,
  };
}

/**
 * Get recommendations for failing color combinations
 */
export function getContrastRecommendations(result: ContrastTestResult): string[] {
  const recommendations: string[] = [];

  if (!result.meetsAA) {
    recommendations.push(
      `Current ratio ${result.ratio.toFixed(2)}:1 does not meet WCAG AA (requires 4.5:1 for normal text, 3:1 for large text)`
    );

    // Suggest darker foreground or lighter background
    if (result.ratio < 3) {
      recommendations.push(
        'Consider using a darker shade for text or a lighter background'
      );
    }

    // Suggest specific color adjustments
    recommendations.push(
      'Try using a darker shade from the same color family (e.g., 700 or 800 instead of 500)'
    );
  }

  if (result.meetsAA && !result.meetsAAA) {
    recommendations.push(
      'Meets WCAG AA but not AAA. Consider improving contrast for better accessibility.'
    );
  }

  return recommendations;
}

/**
 * Format contrast ratio for display
 */
export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

/**
 * Get WCAG level badge
 */
export function getWCAGLevel(result: ContrastTestResult, isLargeText: boolean = false): {
  level: 'AAA' | 'AA' | 'Fail';
  color: string;
} {
  if (isLargeText != null) {
    if (result.meetsAAALarge) {
      return { level: 'AAA', color: 'success' };
    } else if (result.meetsAALarge) {
      return { level: 'AA', color: 'warning' };
    }
  } else {
    if (result.meetsAAA) {
      return { level: 'AAA', color: 'success' };
    } else if (result.meetsAA) {
      return { level: 'AA', color: 'warning' };
    }
  }

  return { level: 'Fail', color: 'error' };
}

/**
 * Export contrast verification results as JSON
 */
export function exportContrastResults(results: ContrastTestResult[]): string {
  const summary = getContrastSummary(results);

  return JSON.stringify(
    {
      summary,
      results: results.map(r => ({
        ...r,
        formattedRatio: formatContrastRatio(r.ratio),
        wcagLevel: getWCAGLevel(r),
        recommendations: getContrastRecommendations(r),
      })),
      timestamp: new Date().toISOString(),
    },
    null,
    2
  );
}
