// @ts-nocheck
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Button } from './Button';
import {
  verifyDesignTokenContrast,
  getContrastSummary,
  formatContrastRatio,
  getWCAGLevel,
  getContrastRecommendations,
  exportContrastResults,
  type ContrastTestResult,
} from '@/lib/color-contrast-verification';

/**
 * ColorContrastChecker Component
 *
 * A development tool for verifying WCAG color contrast compliance.
 * This component should only be used in development/testing environments.
 *
 * Requirements: 10.3 - WCAG AA contrast ratios verification
 */
export default function ColorContrastChecker() {
  const [results, setResults] = useState<ContrastTestResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ContrastTestResult | null>(null);

  const runTests = () => {
    const testResults = verifyDesignTokenContrast();
    setResults(testResults);
    setIsOpen(true);
  };

  const exportResults = () => {
    const json = exportContrastResults(results);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contrast-verification-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <button
        onClick={runTests}
        className="fixed top-20 right-4 z-[1100] px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label="Check color contrast"
        title="Color Contrast Checker (Dev Tool)"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Contrast
        </span>
      </button>
    );
  }

  const summary = getContrastSummary(results);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1300]"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[1400] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contrast-checker-title"
      >
        <Card
          className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          elevation="xl"
          padding="none"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="contrast-checker-title" className="text-2xd text-neutral-900 dark:text-neutral-50">
                  Color Contrast Verification
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  WCAG AA Compliance Check (4.5:1 for normal text, 3:1 for large text)
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Close contrast checker"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Summary */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{summary.total}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Total Tests</div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{summary.passing}</div>
                <div className="text-xs text-green-600 dark:text-green-500">Passing</div>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">{summary.failing}</div>
                <div className="text-xs text-red-600 dark:text-red-500">Failing</div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{summary.passRate.toFixed(0)}%</div>
                <div className="text-xs text-blue-600 dark:text-blue-500">Pass Rate</div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={exportResults}>
                Export Results
              </Button>
              <Button variant="outline" size="sm" onClick={runTests}>
                Re-run Tests
              </Button>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-3">
              {results.map((result, index) => {
                const wcagLevel = getWCAGLevel(result);
                const recommendations = getContrastRecommendations(result);

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      result.meetsAA
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                    } ${selectedResult === result ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => setSelectedResult(selectedResult === result ? null : result)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
                            {result.description}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded ${
                              wcagLevel.level === 'AAA'
                                ? 'bg-green-600 text-white'
                                : wcagLevel.level === 'AA'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {wcagLevel.level}
                          </span>
                          <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
                            {formatContrastRatio(result.ratio)}
                          </span>
                        </div>

                        {/* Color Swatches */}
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-600"
                              style={{ backgroundColor: result.foreground }}
                              title={result.foreground}
                            />
                            <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                              {result.foreground}
                            </span>
                          </div>
                          <span className="text-neutral-400">on</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-600"
                              style={{ backgroundColor: result.background }}
                              title={result.background}
                            />
                            <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                              {result.background}
                            </span>
                          </div>
                        </div>

                        {/* Preview */}
                        <div
                          className="p-3 rounded border border-neutral-300 dark:border-neutral-600 mb-2"
                          style={{
                            backgroundColor: result.background,
                            color: result.foreground,
                          }}
                        >
                          <p className="text-base">Normal text preview (16px)</p>
                          <p className="text-lg font-bold">Large text preview (18px bold)</p>
                        </div>

                        {/* Recommendations */}
                        {selectedResult === result && recommendations.length > 0 && (
                          <div className="mt-3 p-3 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                              Recommendations:
                            </h4>
                            <ul className="space-y-1">
                              {recommendations.map((rec, i) => (
                                <li key={i} className="text-xs text-neutral-600 dark:text-neutral-400">
                                  • {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Status Icons */}
                      <div className="flex flex-col items-end gap-1 ml-4">
                        {result.meetsAA ? (
                          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
