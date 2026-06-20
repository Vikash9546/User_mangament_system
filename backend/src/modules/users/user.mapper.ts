import { User } from '@prisma/client';
import { maskAadhaar, maskPAN } from '../../utils/mask';

export function mapUserResponse(user: User) {
  return {
    ...user,
    aadhaar: maskAadhaar(user.aadhaar),
    pan: maskPAN(user.pan),
  };
}
