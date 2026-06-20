import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { sendSuccess } from '../../utils/response';
import { mapUserResponse } from './user.mapper';

export class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.create(req.body);
      return sendSuccess(res, 'User created successfully', mapUserResponse(user), 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.update(req.params.id as string, req.body);
      return sendSuccess(res, 'User updated successfully', mapUserResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getById(req.params.id as string);
      return sendSuccess(res, 'User retrieved successfully', mapUserResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.getUsers(req.query);
      return res.status(200).json({
        success: true,
        data: data.users.map(mapUserResponse),
        pagination: data.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.delete(req.params.id as string);
      return sendSuccess(res, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async restore(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.restore(req.params.id as string);
      return sendSuccess(res, 'User restored successfully', mapUserResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async hardDelete(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.hardDelete(req.params.id as string);
      return sendSuccess(res, 'User permanently deleted');
    } catch (error) {
      next(error);
    }
  }

  async validateDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const { pan, aadhaar } = req.body;
      const result = await userService.validateDocuments(pan, aadhaar);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
