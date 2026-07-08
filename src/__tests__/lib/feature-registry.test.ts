import { describe, it, expect } from 'vitest';
import {
  FEATURE_REGISTRY,
  getDefaultSectionsForType,
  isFeatureAvailableOnPlan,
  getFeaturesByCategory,
  getLockedFeatures,
  getRecommendedFeatures,
  CATEGORY_LABELS,
} from '@/lib/feature-registry';

describe('Feature Registry', () => {
  describe('FEATURE_REGISTRY', () => {
    it('should have at least 20 features defined', () => {
      expect(FEATURE_REGISTRY.length).toBeGreaterThanOrEqual(20);
    });

    it('should have unique IDs', () => {
      const ids = FEATURE_REGISTRY.map((f) => f.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have valid tiers for all features', () => {
      const validTiers = ['free', 'starter', 'professional', 'agency'];
      for (const feature of FEATURE_REGISTRY) {
        expect(validTiers).toContain(feature.tier);
      }
    });

    it('should have valid categories for all features', () => {
      const validCategories = ['core', 'engagement', 'conversion', 'trust', 'advanced'];
      for (const feature of FEATURE_REGISTRY) {
        expect(validCategories).toContain(feature.category);
      }
    });

    it('core features should all be free tier', () => {
      const coreFeatures = FEATURE_REGISTRY.filter((f) => f.category === 'core');
      for (const feature of coreFeatures) {
        expect(feature.tier).toBe('free');
      }
    });
  });

  describe('getDefaultSectionsForType', () => {
    it('should return sections for a valid business type', () => {
      const sections = getDefaultSectionsForType('restaurants-cafes');
      expect(sections.length).toBe(FEATURE_REGISTRY.length);
      expect(sections.find((s) => s.id === 'hero')?.enabled).toBe(true);
      expect(sections.find((s) => s.id === 'services')?.enabled).toBe(true);
    });

    it('should enable industry-specific features', () => {
      const healthcareSections = getDefaultSectionsForType('healthcare-professionals');
      const teamSection = healthcareSections.find((s) => s.id === 'team');
      expect(teamSection?.enabled).toBe(true); // Team is default-enabled for healthcare
    });

    it('should return all features disabled for unknown type', () => {
      const sections = getDefaultSectionsForType('unknown-category');
      // Core features with defaultEnabled=true should still be enabled
      expect(sections.find((s) => s.id === 'hero')?.enabled).toBe(true);
    });
  });

  describe('isFeatureAvailableOnPlan', () => {
    it('should allow free features on all plans', () => {
      expect(isFeatureAvailableOnPlan('hero', 'free')).toBe(true);
      expect(isFeatureAvailableOnPlan('hero', 'starter')).toBe(true);
      expect(isFeatureAvailableOnPlan('hero', 'professional')).toBe(true);
      expect(isFeatureAvailableOnPlan('hero', 'agency')).toBe(true);
    });

    it('should block starter features on free plan', () => {
      expect(isFeatureAvailableOnPlan('booking', 'free')).toBe(false);
    });

    it('should allow starter features on starter+ plans', () => {
      expect(isFeatureAvailableOnPlan('booking', 'starter')).toBe(true);
      expect(isFeatureAvailableOnPlan('booking', 'professional')).toBe(true);
    });

    it('should block professional features on starter plan', () => {
      expect(isFeatureAvailableOnPlan('staffCards', 'starter')).toBe(false);
      expect(isFeatureAvailableOnPlan('staffCards', 'professional')).toBe(true);
    });

    it('should return false for unknown feature', () => {
      expect(isFeatureAvailableOnPlan('nonexistent', 'agency')).toBe(false);
    });
  });

  describe('getFeaturesByCategory', () => {
    it('should group features by category', () => {
      const grouped = getFeaturesByCategory();
      expect(Object.keys(grouped)).toContain('core');
      expect(Object.keys(grouped)).toContain('engagement');
      expect(Object.keys(grouped)).toContain('conversion');
      expect(Object.keys(grouped)).toContain('trust');
      expect(Object.keys(grouped)).toContain('advanced');
    });

    it('should have core category with 5 features', () => {
      const grouped = getFeaturesByCategory();
      expect(grouped.core.length).toBe(5);
    });
  });

  describe('getLockedFeatures', () => {
    it('should return no locked features for agency plan', () => {
      const locked = getLockedFeatures('agency');
      expect(locked.length).toBe(0);
    });

    it('should return professional-tier features as locked on starter', () => {
      const locked = getLockedFeatures('starter');
      expect(locked.length).toBeGreaterThan(0);
      expect(locked.every((f) => f.tier === 'professional' || f.tier === 'agency')).toBe(true);
    });

    it('should return all non-free features as locked on free', () => {
      const locked = getLockedFeatures('free');
      const nonFree = FEATURE_REGISTRY.filter((f) => f.tier !== 'free');
      expect(locked.length).toBe(nonFree.length);
    });
  });

  describe('getRecommendedFeatures', () => {
    it('should include core features for any category', () => {
      const recommended = getRecommendedFeatures('restaurants-cafes');
      expect(recommended).toContain('hero');
      expect(recommended).toContain('about');
      expect(recommended).toContain('services');
      expect(recommended).toContain('contact');
    });

    it('should include industry-specific features', () => {
      const healthcareRecs = getRecommendedFeatures('healthcare-professionals');
      expect(healthcareRecs).toContain('team');
      expect(healthcareRecs).toContain('booking');
      expect(healthcareRecs).toContain('qa');
    });
  });

  describe('CATEGORY_LABELS', () => {
    it('should have labels for all categories', () => {
      expect(CATEGORY_LABELS.core).toBeDefined();
      expect(CATEGORY_LABELS.core.label).toBe('Core');
      expect(CATEGORY_LABELS.engagement.label).toBe('Engagement');
    });
  });
});
