import { validatePAN } from '../panValidator';
import { validateAadhaar } from '../aadhaarValidator';
import { maskPAN, maskAadhaar } from '../mask';
import { sanitizeSensitiveData } from '../logSanitizer';

describe('Security Features', () => {
  describe('PAN Validator', () => {
    it('validates correct PAN', () => {
      expect(validatePAN('ABCDE1234F')).toBe(true);
      expect(validatePAN('WXYZP9876Q')).toBe(true);
    });

    it('rejects invalid PAN format', () => {
      expect(validatePAN('ABCDE12345')).toBe(false); // Last char not alphabet
      expect(validatePAN('ABCD12345F')).toBe(false); // Only 4 first letters
      expect(validatePAN('abcde1234f')).toBe(false); // Lowercase
    });

    it('rejects wrong length', () => {
      expect(validatePAN('ABCDE1234')).toBe(false);
      expect(validatePAN('ABCDE12345F')).toBe(false);
    });
  });

  describe('Aadhaar Validator', () => {
    // Note: The verhoeff check needs a valid Aadhaar number to return true.
    // We will test structural properties mainly and simulate a check.
    // '123456789012' usually fails Verhoeff, but let's test one known valid or invalid behaviors.
    
    it('rejects invalid length', () => {
      expect(validateAadhaar('12345678901')).toBe(false); // 11 digits
      expect(validateAadhaar('1234567890123')).toBe(false); // 13 digits
    });

    it('rejects non-numeric characters', () => {
      expect(validateAadhaar('12345678901A')).toBe(false);
      expect(validateAadhaar('1234 5678 90')).toBe(false);
    });
    
    it('returns boolean from Verhoeff check', () => {
      // Just verifying it runs and returns false for a randomly generated invalid number
      expect(validateAadhaar('123456789012')).toBe(false);
    });
  });

  describe('Masking Functions', () => {
    it('masks PAN correctly', () => {
      expect(maskPAN('ABCDE1234F')).toBe('XXXXXX234F');
      expect(maskPAN('ABC')).toBe('ABC'); // Too short to mask
      expect(maskPAN(null)).toBe('');
    });

    it('masks Aadhaar correctly', () => {
      expect(maskAadhaar('123456789012')).toBe('XXXXXXXX9012');
      expect(maskAadhaar('123')).toBe('123'); // Too short to mask
      expect(maskAadhaar('')).toBe('');
    });
  });

  describe('Log Sanitizer', () => {
    it('sanitizes nested sensitive data', () => {
      const payload = {
        name: 'John',
        aadhaar: '123456789012',
        nested: {
          pan: 'ABCDE1234F',
          password: 'secretpassword',
        }
      };

      const sanitized = sanitizeSensitiveData(payload);

      expect(sanitized.name).toBe('John');
      expect(sanitized.aadhaar).toBe('XXXXXXXX9012');
      expect(sanitized.nested.pan).toBe('XXXXXX234F');
      expect(sanitized.nested.password).toBe('[REDACTED]');
    });

    it('handles null and non-object inputs', () => {
      expect(sanitizeSensitiveData(null)).toBe(null);
      expect(sanitizeSensitiveData('string')).toBe('string');
    });
  });
});
