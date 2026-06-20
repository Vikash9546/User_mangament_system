import { prisma } from '../../config/prisma';
import { Prisma, User } from '@prisma/client';

export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByAadhaar(aadhaar: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { aadhaar },
    });
  }

  async findByPan(pan: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { pan },
    });
  }

  async findMany(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return prisma.user.findMany(args);
  }

  async softDelete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async restore(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
        isActive: true,
      },
    });
  }

  async hardDelete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
