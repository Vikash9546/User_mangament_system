import { maskAadhaar, maskPAN } from './mask';

const SENSITIVE_KEYS = ['aadhaar', 'pan', 'password', 'token', 'authorization'];

export function sanitizeSensitiveData(payload: any): any {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map(sanitizeSensitiveData);
  }

  const sanitized: any = {};
  for (const key in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const lowerKey = key.toLowerCase();
      
      if (SENSITIVE_KEYS.some(k => lowerKey.includes(k))) {
        if (lowerKey === 'aadhaar') {
          sanitized[key] = maskAadhaar(payload[key]);
        } else if (lowerKey === 'pan') {
          sanitized[key] = maskPAN(payload[key]);
        } else {
          sanitized[key] = '[REDACTED]';
        }
      } else if (typeof payload[key] === 'object' && payload[key] !== null) {
        sanitized[key] = sanitizeSensitiveData(payload[key]);
      } else {
        sanitized[key] = payload[key];
      }
    }
  }

  return sanitized;
}
