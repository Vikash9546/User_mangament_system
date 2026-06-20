import { z } from 'zod';
import { validatePAN } from '../../utils/panValidator';
import { validateAadhaar } from '../../utils/aadhaarValidator';

const MOBILE_REGEX = /^\d{10}$/;

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    primaryMobile: z.string().regex(MOBILE_REGEX, 'Must be exactly 10 digits'),
    secondaryMobile: z.string().regex(MOBILE_REGEX, 'Must be exactly 10 digits').optional(),
    aadhaar: z.string().refine(validateAadhaar, 'Invalid Aadhaar number'),
    pan: z.string().refine(validatePAN, 'Invalid PAN number'),
    dateOfBirth: z.string().refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, 'Must be a valid past date'),
    placeOfBirth: z.string().min(1),
    currentAddress: z.string().min(1).max(500),
    permanentAddress: z.string().min(1).max(500),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    primaryMobile: z.string().regex(MOBILE_REGEX, 'Must be exactly 10 digits').optional(),
    secondaryMobile: z.string().regex(MOBILE_REGEX, 'Must be exactly 10 digits').optional(),
    aadhaar: z.string().refine(validateAadhaar, 'Invalid Aadhaar number').optional(),
    pan: z.string().refine(validatePAN, 'Invalid PAN number').optional(),
    dateOfBirth: z.string().refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, 'Must be a valid past date').optional(),
    placeOfBirth: z.string().min(1).optional(),
    currentAddress: z.string().min(1).max(500).optional(),
    permanentAddress: z.string().min(1).max(500).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  })
});

export const getUserParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  })
});

export const getUsersQuerySchema = z.object({
  query: z.object({
    cursor: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    status: z.enum(['active', 'deleted', 'all']).optional(),
    sortBy: z.enum(['createdAt', 'name']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
});

export const validateDocumentSchema = z.object({
  body: z.object({
    pan: z.string().optional(),
    aadhaar: z.string().optional()
  })
});
