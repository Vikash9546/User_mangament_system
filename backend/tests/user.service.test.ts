import { userService } from '../src/modules/users/user.service';
import { userRepository } from '../src/modules/users/user.repository';

jest.mock('../src/modules/users/user.repository');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user if no duplicates exist', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.findByPan as jest.Mock).mockResolvedValue(null);
      (userRepository.findByAadhaar as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockResolvedValue({ id: '1', name: 'John Doe' });

      const result = await userService.create({
        name: 'John Doe',
        email: 'test@test.com',
        primaryMobile: '1234567890',
        aadhaar: '123456789012',
        pan: 'ABCDE1234F',
        dateOfBirth: '1990-01-01',
        placeOfBirth: 'City',
        currentAddress: 'Address',
        permanentAddress: 'Address'
      });

      expect(result).toEqual({ id: '1', name: 'John Doe' });
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('should throw an error if email exists', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue({ id: '2' });

      await expect(userService.create({
        name: 'John Doe',
        email: 'test@test.com',
        primaryMobile: '1234567890',
        aadhaar: '123456789012',
        pan: 'ABCDE1234F',
        dateOfBirth: '1990-01-01',
        placeOfBirth: 'City',
        currentAddress: 'Address',
        permanentAddress: 'Address'
      })).rejects.toEqual({ name: 'ValidationError', message: 'Email already exists' });
    });
  });

  describe('delete', () => {
    it('should soft delete a user', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue({ id: '1', isDeleted: false });
      (userRepository.softDelete as jest.Mock).mockResolvedValue({ id: '1', isDeleted: true });

      const result = await userService.delete('1');
      expect(result.isDeleted).toBe(true);
    });

    it('should throw an error if user is already deleted', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue({ id: '1', isDeleted: true });

      await expect(userService.delete('1')).rejects.toEqual({ name: 'ValidationError', message: 'User is already deleted' });
    });
  });
});
