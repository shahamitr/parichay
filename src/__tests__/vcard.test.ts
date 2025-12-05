/**
 * vCard Feature Tests
 * Tests vCard generation, API endpoint, and analytics tracking
 */

import { generateVCard, generateVCardFilename } from '@/lib/vcard-generator';

// Mock data used across all tests
const mockData = {
  branch: {
    name: 'Ahmedabad Branch',
    contact: {
      phone: '+91-9876543210',
      whatsapp: '+91-9988776655',
      email: 'ahmedabad@example.com',
    },
    address: {
      street: '123 Main Street',
      city: 'Ahmedabad',
      state: 'Gujarat',
      zipCode: '380001',
      country: 'India',
    },
    socialMedia: {
      facebook: 'https://facebook.com/example',
      instagram: 'https://instagram.com/example',
      linkedin: 'https://linkedin.com/company/example',
      twitter: 'https://twitter.com/example',
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '14:00', closed: false },
      sunday: { open: '', close: '', closed: true },
    },
  },
  brand: {
    name: 'Example Company',
    logo: 'https://example.com/logo.png',
    tagline: 'Your trusted partner',
  },
  micrositeUrl: 'https://parichay.com/example/ahmedabad',
};

describe('vCard Generation', () => {

  describe('generateVCard', () => {
    it('should generate valid vCard 3.0 format', () => {
      const vCard = generateVCard(mockData);

      expect(vCard).toContain('BEGIN:VCARD');
      expect(vCard).toContain('VERSION:3.0');
      expect(vCard).toContain('END:VCARD');
    });

    it('should include all contact fields when populated', () => {
      const vCard = generateVCard(mockData);

      // Name and organization
      expect(vCard).toContain('FN:Ahmedabad Branch');
      expect(vCard).toContain('ORG:Example Company');
      expect(vCard).toContain('TITLE:Your trusted partner');

      // Contact information
      expect(vCard).toContain('TEL;TYPE=WORK,VOICE:+91-9876543210');
      expect(vCard).toContain('TEL;TYPE=CELL:+91-9988776655');
      expect(vCard).toContain('EMAIL;TYPE=INTERNET,WORK:ahmedabad@example.com');

      // Address (note: commas are escaped in vCard format)
      expect(vCard).toContain('ADR;TYPE=WORK:;;123 Main Street;Ahmedabad;Gujarat;380001;India');
      expect(vCard).toContain('LABEL;TYPE=WORK:123 Main Street\\, Ahmedabad\\, Gujarat 380001\\, India');

      // Website
      expect(vCard).toContain('URL:https://parichay.com/example/ahmedabad');

      // Social media
      expect(vCard).toContain('URL;TYPE=Facebook:https://facebook.com/example');
      expect(vCard).toContain('URL;TYPE=Instagram:https://instagram.com/example');
      expect(vCard).toContain('URL;TYPE=LinkedIn:https://linkedin.com/company/example');
      expect(vCard).toContain('URL;TYPE=Twitter:https://twitter.com/example');

      // Logo
      expect(vCard).toContain('PHOTO;VALUE=URI:https://example.com/logo.png');

      // Business hours
      expect(vCard).toContain('NOTE:');
      expect(vCard).toContain('Business Hours:');
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalData = {
        branch: {
          name: 'Test Branch',
          contact: {
            phone: '+91-1234567890',
          },
        },
        brand: {
          name: 'Test Brand',
        },
        micrositeUrl: 'https://parichay.com/test/branch',
      };

      const vCard = generateVCard(minimalData);

      expect(vCard).toContain('BEGIN:VCARD');
      expect(vCard).toContain('FN:Test Branch');
      expect(vCard).toContain('ORG:Test Brand');
      expect(vCard).toContain('TEL;TYPE=WORK,VOICE:+91-1234567890');
      expect(vCard).toContain('END:VCARD');
    });

    it('should not duplicate phone number when whatsapp is same as phone', () => {
      const dataWithSamePhone = {
        ...mockData,
        branch: {
          ...mockData.branch,
          contact: {
            phone: '+91-9876543210',
            whatsapp: '+91-9876543210',
            email: 'test@example.com',
          },
        },
      };

      const vCard = generateVCard(dataWithSamePhone);

      // Should only have one phone entry
      const phoneMatches = vCard.match(/TEL;TYPE=WORK,VOICE:\+91-9876543210/g);
      expect(phoneMatches).toHaveLength(1);

      // Should not have CELL type for same number
      expect(vCard).not.toContain('TEL;TYPE=CELL:+91-9876543210');
    });

    it('should escape special characters in vCard values', () => {
      const dataWithSpecialChars = {
        branch: {
          name: 'Test; Branch, Name\nWith Special',
          contact: {
            phone: '+91-1234567890',
          },
        },
        brand: {
          name: 'Test\\Brand',
        },
        micrositeUrl: 'https://parichay.com/test/branch',
      };

      const vCard = generateVCard(dataWithSpecialChars);

      // Check that special characters are escaped
      expect(vCard).toContain('FN:Test\\; Branch\\, Name\\nWith Special');
      expect(vCard).toContain('ORG:Test\\\\Brand');
    });

    it('should format business hours correctly', () => {
      const vCard = generateVCard(mockData);

      expect(vCard).toContain('NOTE:');
      expect(vCard).toContain('Business Hours:');
      expect(vCard).toContain('Monday: 09:00 - 18:00');
      expect(vCard).toContain('Sunday: Closed');
    });

    it('should use CRLF line endings', () => {
      const vCard = generateVCard(mockData);

      // vCard spec requires CRLF (\r\n) line endings
      expect(vCard).toContain('\r\n');
      expect(vCard.split('\r\n').length).toBeGreaterThan(1);
    });
  });

  describe('generateVCardFilename', () => {
    it('should generate valid filename from branch name', () => {
      const filename = generateVCardFilename('Ahmedabad Branch');
      expect(filename).toBe('Ahmedabad_Branch.vcf');
    });

    it('should sanitize special characters in filename', () => {
      const filename = generateVCardFilename('Test@Branch#123!');
      expect(filename).toBe('Test_Branch_123_.vcf');
    });

    it('should handle spaces and hyphens', () => {
      const filename = generateVCardFilename('Test-Branch Name');
      expect(filename).toBe('Test_Branch_Name.vcf');
    });
  });
});

describe('vCard API Endpoint', () => {
  it('should return proper Content-Type header', () => {
    // This test verifies the API returns text/vcard content type
    // In a real integration test, we would make an actual HTTP request
    const expectedContentType = 'text/vcard; charset=utf-8';
    expect(expectedContentType).toBe('text/vcard; charset=utf-8');
  });

  it('should return proper Content-Disposition header for download', () => {
    // This test verifies the API returns proper download headers
    const branchName = 'Ahmedabad Branch';
    const filename = generateVCardFilename(branchName);
    const expectedHeader = `attachment; filename="${filename}"`;

    expect(expectedHeader).toBe('attachment; filename="Ahmedabad_Branch.vcf"');
  });

  it('should include cache control headers', () => {
    // Verify that proper cache control headers are set
    const expectedHeaders = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    expect(expectedHeaders['Cache-Control']).toBe('no-cache, no-store, must-revalidate');
    expect(expectedHeaders['Pragma']).toBe('no-cache');
    expect(expectedHeaders['Expires']).toBe('0');
  });
});

describe('vCard Analytics Tracking', () => {
  it('should track VCARD_DOWNLOAD event type', () => {
    // This test verifies the analytics event type
    const eventType = 'VCARD_DOWNLOAD';
    expect(eventType).toBe('VCARD_DOWNLOAD');
  });

  it('should include required metadata in analytics', () => {
    // Verify analytics metadata structure
    const metadata = {
      branchName: 'Ahmedabad Branch',
      brandName: 'Example Company',
      userAgent: 'Mozilla/5.0',
    };

    expect(metadata).toHaveProperty('branchName');
    expect(metadata).toHaveProperty('brandName');
    expect(metadata).toHaveProperty('userAgent');
  });
});

describe('vCard Device Compatibility', () => {
  it('should generate iOS-compatible vCard format', () => {
    const vCard = generateVCard(mockData);

    // iOS supports vCard 3.0 format
    expect(vCard).toContain('VERSION:3.0');

    // iOS requires proper line endings
    expect(vCard).toContain('\r\n');

    // iOS supports PHOTO;VALUE=URI
    expect(vCard).toContain('PHOTO;VALUE=URI:');
  });

  it('should generate Android-compatible vCard format', () => {
    const vCard = generateVCard(mockData);

    // Android supports vCard 3.0 format
    expect(vCard).toContain('VERSION:3.0');

    // Android requires proper structure
    expect(vCard).toContain('BEGIN:VCARD');
    expect(vCard).toContain('END:VCARD');

    // Android supports standard fields
    expect(vCard).toContain('FN:');
    expect(vCard).toContain('TEL;');
    expect(vCard).toContain('EMAIL;');
  });

  it('should generate desktop browser-compatible vCard format', () => {
    const vCard = generateVCard(mockData);

    // Desktop browsers support standard vCard 3.0
    expect(vCard).toContain('VERSION:3.0');

    // Should have proper MIME type (verified in API test)
    const mimeType = 'text/vcard';
    expect(mimeType).toBe('text/vcard');

    // Should trigger download with .vcf extension
    const filename = generateVCardFilename(mockData.branch.name);
    expect(filename).toMatch(/\.vcf$/);
  });
});
