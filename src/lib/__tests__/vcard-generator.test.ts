/**
 * vCard Generator Tests
 * Tests for vCard 3.0 generation with all contact fields
 */

import { generateVCard, generateVCardFilename, VCardData } from '../vcard-generator';

describe('vCard Generator', () => {
    const mockData: VCardData = {
        branch: {
            name: 'Test Branch',
            contact: {
                phone: '+1234567890',
                email: 'test@example.com',
                whatsapp: '+0987654321',
            },
            address: {
                street: '123 Test St',
                city: 'Test City',
                state: 'Test State',
                zipCode: '12345',
                country: 'Test Country',
            },
            socialMedia: {
                facebook: 'https://facebook.com/test',
                instagram: 'https://instagram.com/test',
            },
            businessHours: {
                monday: { open: '09:00', close: '17:00', closed: false },
                tuesday: { open: '09:00', close: '17:00', closed: false },
                sunday: { open: '00:00', close: '00:00', closed: true },
            },
        },
        brand: {
            name: 'Test Brand',
            tagline: 'Test Tagline',
            logo: 'https://example.com/logo.png',
        },
        micrositeUrl: 'https://onetouchbizcard.in/test-brand/test-branch',
    };

    describe('generateVCard', () => {
        it('should generate valid vCard 3.0 content', () => {
            const vCard = generateVCard(mockData);

            expect(vCard).toContain('BEGIN:VCARD');
            expect(vCard).toContain('VERSION:3.0');
            expect(vCard).toContain('END:VCARD');
        });

        it('should include basic contact info', () => {
            const vCard = generateVCard(mockData);

            expect(vCard).toContain('FN:Test Branch');
            expect(vCard).toContain('ORG:Test Brand');
            expect(vCard).toContain('TITLE:Test Tagline');
            expect(vCard).toContain('TEL;TYPE=WORK,VOICE:+1234567890');
            expect(vCard).toContain('EMAIL;TYPE=INTERNET,WORK:test@example.com');
            expect(vCard).toContain('URL:https://onetouchbizcard.in/test-brand/test-branch');
        });

        it('should include address', () => {
            const vCard = generateVCard(mockData);

            // Check for structured address
            expect(vCard).toContain('ADR;TYPE=WORK:;;123 Test St;Test City;Test State;12345;Test Country');
            // Check for label
            expect(vCard).toContain('LABEL;TYPE=WORK:123 Test St\\, Test City\\, Test State 12345\\, Test Country');
        });

        it('should include social media links', () => {
            const vCard = generateVCard(mockData);

            expect(vCard).toContain('URL;TYPE=Facebook:https://facebook.com/test');
            expect(vCard).toContain('URL;TYPE=Instagram:https://instagram.com/test');
        });

        it('should include business hours in NOTE field', () => {
            const vCard = generateVCard(mockData);

            expect(vCard).toContain('NOTE:Business Hours:\\nMonday: 09:00 - 17:00\\nTuesday: 09:00 - 17:00\\nSunday: Closed');
        });

        it('should escape special characters', () => {
            const dataWithSpecialChars: VCardData = {
                ...mockData,
                branch: {
                    ...mockData.branch,
                    name: 'Branch, with; special chars',
                    address: {
                        ...mockData.branch.address!,
                        street: '123, Test St; Apt 4',
                    },
                },
            };

            const vCard = generateVCard(dataWithSpecialChars);

            expect(vCard).toContain('FN:Branch\\, with\\; special chars');
            expect(vCard).toContain('123\\, Test St\\; Apt 4');
        });

        it('should handle missing optional fields', () => {
            const minimalData: VCardData = {
                branch: {
                    name: 'Minimal Branch',
                    contact: {},
                },
                brand: {
                    name: 'Minimal Brand',
                },
                micrositeUrl: 'https://example.com',
            };

            const vCard = generateVCard(minimalData);

            expect(vCard).toContain('FN:Minimal Branch');
            expect(vCard).toContain('ORG:Minimal Brand');
            expect(vCard).not.toContain('TEL');
            expect(vCard).not.toContain('EMAIL');
            expect(vCard).not.toContain('ADR');
        });
    });

    describe('generateVCardFilename', () => {
        it('should generate sanitized filename', () => {
            expect(generateVCardFilename('Test Branch')).toBe('Test_Branch.vcf');
            expect(generateVCardFilename('Branch @ 123')).toBe('Branch___123.vcf');
        });
    });
});