import { describe, it, expect, beforeAll } from 'vitest';

// Set test encryption key before importing the module
beforeAll(() => {
  process.env.ENCRYPTION_KEY = 'a'.repeat(64); // 32 bytes in hex
});

describe('Encryption Module', () => {
  let encrypt: typeof import('@/lib/encryption').encrypt;
  let decrypt: typeof import('@/lib/encryption').decrypt;
  let encryptPhone: typeof import('@/lib/encryption').encryptPhone;
  let decryptPhone: typeof import('@/lib/encryption').decryptPhone;
  let hashForSearch: typeof import('@/lib/encryption').hashForSearch;
  let encryptContactFields: typeof import('@/lib/encryption').encryptContactFields;
  let decryptContactFields: typeof import('@/lib/encryption').decryptContactFields;

  beforeAll(async () => {
    const mod = await import('@/lib/encryption');
    encrypt = mod.encrypt;
    decrypt = mod.decrypt;
    encryptPhone = mod.encryptPhone;
    decryptPhone = mod.decryptPhone;
    hashForSearch = mod.hashForSearch;
    encryptContactFields = mod.encryptContactFields;
    decryptContactFields = mod.decryptContactFields;
  });

  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt a string correctly', () => {
      const plaintext = 'Hello, World!';
      const encrypted = encrypt(plaintext);
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toContain(':'); // format: iv:authTag:ciphertext
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(plaintext);
    });

    it('should return different ciphertext for same plaintext (random IV)', () => {
      const plaintext = 'test value';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle empty strings', () => {
      expect(encrypt('')).toBe('');
      expect(decrypt('')).toBe('');
    });

    it('should handle null/undefined gracefully', () => {
      expect(encrypt(null as any)).toBe(null);
      expect(decrypt(undefined as any)).toBe(undefined);
    });

    it('should decrypt unencrypted legacy data as-is', () => {
      const legacyValue = '+91 98765 43210'; // No colons in iv:tag:cipher format
      expect(decrypt(legacyValue)).toBe(legacyValue);
    });

    it('should handle unicode characters', () => {
      const plaintext = '🏥 Dr. Priya Sharma — हिंदी';
      const encrypted = encrypt(plaintext);
      expect(decrypt(encrypted)).toBe(plaintext);
    });
  });

  describe('encryptPhone / decryptPhone', () => {
    it('should encrypt and decrypt phone numbers', () => {
      const phone = '+91 98765 43210';
      const encrypted = encryptPhone(phone);
      expect(encrypted).not.toBe(phone);
      expect(decryptPhone(encrypted)).toBe(phone);
    });

    it('should return null for null input', () => {
      expect(encryptPhone(null)).toBe(null);
      expect(encryptPhone(undefined)).toBe(null);
      expect(decryptPhone(null)).toBe(null);
    });
  });

  describe('hashForSearch', () => {
    it('should produce consistent hash for same input', () => {
      const hash1 = hashForSearch('+919876543210');
      const hash2 = hashForSearch('+919876543210');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hash for different inputs', () => {
      const hash1 = hashForSearch('+919876543210');
      const hash2 = hashForSearch('+919876543211');
      expect(hash1).not.toBe(hash2);
    });

    it('should be case-insensitive', () => {
      expect(hashForSearch('test@email.com')).toBe(hashForSearch('TEST@EMAIL.COM'));
    });

    it('should return 32 characters', () => {
      expect(hashForSearch('anything').length).toBe(32);
    });
  });

  describe('encryptContactFields / decryptContactFields', () => {
    it('should encrypt sensitive fields in a contact object', () => {
      const contact = { phone: '+919876543210', whatsapp: '+919876543210', email: 'test@test.com', name: 'Test' };
      const encrypted = encryptContactFields(contact);
      expect(encrypted!.phone).not.toBe('+919876543210');
      expect(encrypted!.name).toBe('Test'); // non-sensitive, unchanged
    });

    it('should decrypt sensitive fields back', () => {
      const contact = { phone: '+919876543210', whatsapp: '+919876500000' };
      const encrypted = encryptContactFields(contact);
      const decrypted = decryptContactFields(encrypted);
      expect(decrypted!.phone).toBe('+919876543210');
      expect(decrypted!.whatsapp).toBe('+919876500000');
    });

    it('should handle null contact', () => {
      expect(encryptContactFields(null)).toBe(null);
      expect(decryptContactFields(null)).toBe(null);
    });
  });
});
