import { userRepository } from './user.repository';
import { validatePAN } from '../../utils/panValidator';
import { validateAadhaar } from '../../utils/aadhaarValidator';
import { CreateUserInput, UpdateUserInput, GetUsersQuery } from './user.types';
import { encodeCursor, decodeCursor } from '../../utils/cursor';
import { Prisma } from '@prisma/client';

export class UserService {
  async create(data: CreateUserInput) {
    // Check duplicates
    const emailExists = await userRepository.findByEmail(data.email);
    if (emailExists) throw { name: 'ValidationError', message: 'Email already exists' };

    const panExists = await userRepository.findByPan(data.pan);
    if (panExists) throw { name: 'ValidationError', message: 'PAN already registered' };

    const aadhaarExists = await userRepository.findByAadhaar(data.aadhaar);
    if (aadhaarExists) throw { name: 'ValidationError', message: 'Aadhaar already registered' };

    return userRepository.create({
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
    });
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await userRepository.findById(id);
    if (!user) throw { name: 'NotFoundError', message: 'User not found' };

    if (data.email && data.email !== user.email) {
      const emailExists = await userRepository.findByEmail(data.email);
      if (emailExists) throw { name: 'ValidationError', message: 'Email already exists' };
    }

    if (data.pan && data.pan !== user.pan) {
      const panExists = await userRepository.findByPan(data.pan);
      if (panExists) throw { name: 'ValidationError', message: 'PAN already registered' };
    }

    if (data.aadhaar && data.aadhaar !== user.aadhaar) {
      const aadhaarExists = await userRepository.findByAadhaar(data.aadhaar);
      if (aadhaarExists) throw { name: 'ValidationError', message: 'Aadhaar already registered' };
    }

    const updateData: any = { ...data };
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }

    return userRepository.update(id, updateData);
  }

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw { name: 'NotFoundError', message: 'User not found' };
    return user;
  }

  async getUsers(query: GetUsersQuery) {
    const limit = query.limit || 10;
    const { cursor, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.UserWhereInput = {};

    if (status === 'active') where.isDeleted = false;
    else if (status === 'deleted') where.isDeleted = true;
    // 'all' means no filter on isDeleted

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { pan: { contains: search } },
      ];
    }

    const args: Prisma.UserFindManyArgs = {
      take: limit + 1, // Fetch one extra to check if there is a next page
      where,
      orderBy: [
        { [sortBy]: sortOrder },
        { id: sortOrder }, // stable ordering
      ]
    };

    if (cursor) {
      const decoded = decodeCursor(cursor);
      const [cursorId] = decoded.split('_'); // We can use composite cursor or just ID if sorting by ID.
      // For proper cursor pagination with custom sort, Prisma requires composite unique index or id.
      // We will assume cursor is the ID for simplicity, but strictly we should use the stable unique identifier.
      args.cursor = { id: decoded };
      args.skip = 1; // Skip the cursor itself
    }

    const users = await userRepository.findMany(args);

    let nextCursor: string | null = null;
    let hasMore = false;

    if (users.length > limit) {
      hasMore = true;
      const nextItem = users.pop(); // Remove the extra item
      nextCursor = encodeCursor(users[users.length - 1].id);
    } else if (users.length > 0) {
      // Even if no more pages, some systems return the last cursor
      // but usually hasMore handles it.
    }

    return {
      users,
      pagination: {
        nextCursor,
        hasMore,
      }
    };
  }

  async delete(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw { name: 'NotFoundError', message: 'User not found' };
    if (user.isDeleted) throw { name: 'ValidationError', message: 'User is already deleted' };

    return userRepository.softDelete(id);
  }

  async restore(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw { name: 'NotFoundError', message: 'User not found' };
    if (!user.isDeleted) throw { name: 'ValidationError', message: 'User is not deleted' };

    return userRepository.restore(id);
  }

  async validateDocuments(pan?: string, aadhaar?: string) {
    const result: any = {};

    if (pan) {
      const valid = validatePAN(pan);
      let exists = false;
      if (valid) {
        exists = !!(await userRepository.findByPan(pan));
      }
      result.pan = { valid, exists };
    }

    if (aadhaar) {
      const valid = validateAadhaar(aadhaar);
      let exists = false;
      if (valid) {
        exists = !!(await userRepository.findByAadhaar(aadhaar));
      }
      result.aadhaar = { valid, exists };
    }

    // Determine overall success (if provided documents are valid and don't exist)
    const success = (!pan || (result.pan.valid && !result.pan.exists)) && 
                    (!aadhaar || (result.aadhaar.valid && !result.aadhaar.exists));

    return { success, data: result };
  }
}

export const userService = new UserService();
