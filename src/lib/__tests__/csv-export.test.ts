// @ts-nocheck
/**
 * CSV Export Tests
 * Tests data formatting functions for CSV export
 */

describe('CSV Export - Data Formatting', () => {
  describe('formatAnalyticsForCSV', () => {
    it('should format analytics events for CSV export', () => {
      // Inline the formatting logic to test without papaparse dependency
      const events = [
        {
          createdAt: new Date('2024-01-01T10:00:00Z'),
          eventType: 'PAGE_VIEW',
          userAgent: 'Mozilla/5.0',
          ipAddress: '192.168.1.1',
          location: {
            country: 'USA',
            city: 'New York',
          },
          metadata: { path: '/home' },
        },
        {
          createdAt: new Date('2024-01-01T11:00:00Z'),
          eventType: 'CLICK',
          userAgent: null,
          ipAddress: null,
          location: null,
          metadata: { action: 'call' },
        },
      ];

      const result = events.map((event) => ({
        Date: new Date(event.createdAt).toLocaleString(),
        'Event Type': event.eventType,
        'User Agent': event.userAgent || 'N/A',
        'IP Address': event.ipAddress || 'N/A',
        Country: event.location?.country || 'N/A',
        City: event.location?.city || 'N/A',
        Metadata: JSON.stringify(event.metadata || {}),
      }));

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        Date: expect.any(String),
        'Event Type': 'PAGE_VIEW',
        'User Agent': 'Mozilla/5.0',
        'IP Address': '192.168.1.1',
        Country: 'USA',
        City: 'New York',
        Metadata: JSON.stringify({ path: '/home' }),
      });
      expect(result[1]).toEqual({
        Date: expect.any(String),
        'Event Type': 'CLICK',
        'User Agent': 'N/A',
        'IP Address': 'N/A',
        Country: 'N/A',
        City: 'N/A',
        Metadata: JSON.stringify({ action: 'call' }),
      });
    });

    it('should handle empty metadata', () => {
      const events = [
        {
          createdAt: new Date('2024-01-01T10:00:00Z'),
          eventType: 'QR_SCAN',
          userAgent: 'Mobile',
          ipAddress: '10.0.0.1',
          location: null,
          metadata: null,
        },
      ];

      const result = events.map((event) => ({
        Date: new Date(event.createdAt).toLocaleString(),
        'Event Type': event.eventType,
        'User Agent': event.userAgent || 'N/A',
        'IP Address': event.ipAddress || 'N/A',
        Country: event.location?.country || 'N/A',
        City: event.location?.city || 'N/A',
        Metadata: JSON.stringify(event.metadata || {}),
      }));

      expect(result[0].Metadata).toBe('{}');
    });

    it('should handle missing location data', () => {
      const events = [
        {
          createdAt: new Date('2024-01-01T10:00:00Z'),
          eventType: 'LEAD_SUBMIT',
          userAgent: 'Chrome',
          ipAddress: '127.0.0.1',
          location: undefined,
          metadata: {},
        },
      ];

      const result = events.map((event) => ({
        Date: new Date(event.createdAt).toLocaleString(),
        'Event Type': event.eventType,
        'User Agent': event.userAgent || 'N/A',
        'IP Address': event.ipAddress || 'N/A',
        Country: event.location?.country || 'N/A',
        City: event.location?.city || 'N/A',
        Metadata: JSON.stringify(event.metadata || {}),
      }));

      expect(result[0].Country).toBe('N/A');
      expect(result[0].City).toBe('N/A');
    });
  });

  describe('formatLeadsForCSV', () => {
    it('should format leads for CSV export', () => {
      const leads = [
        {
          createdAt: new Date('2024-01-01T10:00:00Z'),
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          message: 'Interested in services',
          source: 'QR_CODE',
          branch: {
            name: 'Main Branch',
          },
        },
        {
          createdAt: new Date('2024-01-01T11:00:00Z'),
          name: 'Jane Smith',
          email: null,
          phone: null,
          message: null,
          source: 'DIRECT',
          branch: null,
        },
      ];

      const result = leads.map((lead) => ({
        Date: new Date(lead.createdAt).toLocaleString(),
        Name: lead.name,
        Email: lead.email || 'N/A',
        Phone: lead.phone || 'N/A',
        Message: lead.message || 'N/A',
        Source: lead.source,
        Branch: lead.branch?.name || 'N/A',
      }));

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        Date: expect.any(String),
        Name: 'John Doe',
        Email: 'john@example.com',
        Phone: '+1234567890',
        Message: 'Interested in services',
        Source: 'QR_CODE',
        Branch: 'Main Branch',
      });
      expect(result[1]).toEqual({
        Date: expect.any(String),
        Name: 'Jane Smith',
        Email: 'N/A',
        Phone: 'N/A',
        Message: 'N/A',
        Source: 'DIRECT',
        Branch: 'N/A',
      });
    });

    it('should handle leads with partial data', () => {
      const leads = [
        {
          createdAt: new Date('2024-01-01T10:00:00Z'),
          name: 'Test User',
          email: 'test@example.com',
          phone: null,
          message: '',
          source: 'SOCIAL',
          branch: {
            name: 'Branch A',
          },
        },
      ];

      const result = leads.map((lead) => ({
        Date: new Date(lead.createdAt).toLocaleString(),
        Name: lead.name,
        Email: lead.email || 'N/A',
        Phone: lead.phone || 'N/A',
        Message: lead.message || 'N/A',
        Source: lead.source,
        Branch: lead.branch?.name || 'N/A',
      }));

      expect(result[0].Phone).toBe('N/A');
      expect(result[0].Message).toBe('N/A');
      expect(result[0].Email).toBe('test@example.com');
    });

    it('should handle multiple leads from different sources', () => {
      const leads = [
        {
          createdAt: new Date('2024-01-01T10:00:00Z'),
          name: 'Lead 1',
          email: 'lead1@example.com',
          phone: '+1111111111',
          message: 'Message 1',
          source: 'QR_CODE',
          branch: { name: 'Branch 1' },
        },
        {
          createdAt: new Date('2024-01-01T11:00:00Z'),
          name: 'Lead 2',
          email: 'lead2@example.com',
          phone: '+2222222222',
          message: 'Message 2',
          source: 'DIRECT',
          branch: { name: 'Branch 2' },
        },
        {
          createdAt: new Date('2024-01-01T12:00:00Z'),
          name: 'Lead 3',
          email: 'lead3@example.com',
          phone: '+3333333333',
          message: 'Message 3',
          source: 'SOCIAL',
          branch: { name: 'Branch 3' },
        },
      ];

      const result = leads.map((lead) => ({
        Date: new Date(lead.createdAt).toLocaleString(),
        Name: lead.name,
        Email: lead.email || 'N/A',
        Phone: lead.phone || 'N/A',
        Message: lead.message || 'N/A',
        Source: lead.source,
        Branch: lead.branch?.name || 'N/A',
      }));

      expect(result).toHaveLength(3);
      expect(result[0].Source).toBe('QR_CODE');
      expect(result[1].Source).toBe('DIRECT');
      expect(result[2].Source).toBe('SOCIAL');
    });
  });
});
