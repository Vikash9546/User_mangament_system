import { validatePAN } from '../src/utils/panValidator';
import { validateAadhaar } from '../src/utils/aadhaarValidator';

describe('Validators', () => {
  describe('validatePAN', () => {
    it('should return true for valid PAN', () => {
      expect(validatePAN('ABCDE1234F')).toBe(true);
      expect(validatePAN('ZYXWV9876Q')).toBe(true);
    });

    it('should return false for lowercase PAN', () => {
      expect(validatePAN('abcde1234f')).toBe(false);
    });

    it('should return false for invalid structure', () => {
      expect(validatePAN('12345ABCDE')).toBe(false);
      expect(validatePAN('ABCDE12345')).toBe(false);
    });

    it('should return false for invalid length', () => {
      expect(validatePAN('ABCDE1234F1')).toBe(false);
      expect(validatePAN('ABCD1234F')).toBe(false);
    });
  });

  describe('validateAadhaar', () => {
    it('should return false for invalid length', () => {
      expect(validateAadhaar('12345678901')).toBe(false);
      expect(validateAadhaar('1234567890123')).toBe(false);
    });

    it('should return false for non-numeric characters', () => {
      expect(validateAadhaar('12345678901A')).toBe(false);
    });

    it('should return false for invalid checksum', () => {
      // 123456789012 is an invalid Aadhaar number due to failing Verhoeff
      expect(validateAadhaar('123456789012')).toBe(false);
    });
  });
});
