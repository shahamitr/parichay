import {
  trackEvent,
  trackPageView,
  trackContactClick,
  trackLeadSubmit,
  TrackEventOptions,
} from '../analytics-tracker';

// Mock fetch globally
global.fetch = jest.fn();

describe('Analytics Tracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  describe('trackEvent', () => {
    it('should send analytics event to API', async () => {
      const options: TrackEventOptions = {
        eventType: 'PAGE_VIEW',
        branchId: 'branch-123',
        brandId: 'brand-123',
        metadata: { path: '/test' },
      };

      await trackEvent(options);

      expect(global.fetch).toHaveBeenCalledWith('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
    });

    it('should handle API errors silently', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const options: TrackEventOptions = {
        eventType: 'CLICK',
        branchId: 'branch-123',
      };

      await expect(trackEvent(options)).resolves.not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should track different event types', async () => {
      const eventTypes: Array<TrackEventOptions['eventType']> = [
        'PAGE_VIEW',
        'CLICK',
        'QR_SCAN',
        'LEAD_SUBMIT',
      ];

      for (const eventType of eventTypes) {
        await trackEvent({ eventType });
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/analytics/track',
          expect.objectContaining({
            body: expect.stringContaining(eventType),
          })
        );
      }
    });
  });

  describe('trackPageView', () => {
    it('should track page view with branch and brand IDs', async () => {
      const branchId = 'branch-123';
      const brandId = 'brand-123';

      // Mock window and document for browser environment
      (global as any).window = {
        location: { pathname: '/test-page' },
      };
      (global as any).document = {
        referrer: 'https://example.com',
      };

      trackPageView(branchId, brandId);

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('PAGE_VIEW'),
        })
      );

      // Cleanup
      delete (global as any).window;
      delete (global as any).document;
    });
  });

  describe('trackContactClick', () => {
    it('should track contact action clicks', async () => {
      const actions: Array<'call' | 'whatsapp' | 'email' | 'directions'> = [
        'call',
        'whatsapp',
        'email',
        'directions',
      ];

      // Mock window for browser environment
      (global as any).window = {
        location: { pathname: '/test-page' },
      };

      for (const action of actions) {
        trackContactClick(action, 'branch-123', 'brand-123');
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(global.fetch).toHaveBeenCalledWith(
          '/api/analytics/track',
          expect.objectContaining({
            body: expect.stringContaining(action),
          })
        );
      }

      // Cleanup
      delete (global as any).window;
    });
  });

  describe('trackLeadSubmit', () => {
    it('should track lead form submission', async () => {
      const branchId = 'branch-123';
      const brandId = 'brand-123';

      // Mock window for browser environment
      (global as any).window = {
        location: { pathname: '/test-page' },
      };

      trackLeadSubmit(branchId, brandId);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/analytics/track',
        expect.objectContaining({
          body: expect.stringContaining('LEAD_SUBMIT'),
        })
      );

      // Cleanup
      delete (global as any).window;
    });
  });
});
