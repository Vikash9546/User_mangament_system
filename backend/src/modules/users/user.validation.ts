import { z } from 'zod';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const MOBILE_REGEX = /^\d{10}$/;

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    primaryMobile: z.string().regex(MOBILE_REGEX, 'Must be exactly 10 digits'),
    secondaryMobile: z.string().regex(MOBILE_REGEX, 'Must be exactly 10 digits').optional(),
    aadhaar: z.string().regex(AADHAAR_REGEX, 'Must be exactly 12 digits'),
    pan: z.string().regex(PAN_REGEX, 'Invalid PAN format'),
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
    aadhaar: z.string().regex(AADHAAR_REGEX, 'Must be exactly 12 digits').optional(),
    pan: z.string().regex(PAN_REGEX, 'Invalid PAN format').optional(),
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
