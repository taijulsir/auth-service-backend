import User from '#models/User';
import { NotFoundError, BadRequestError } from '#utils/AppError';

export class UserService {
  static async getAllUsers() {
    const users = await User.find().select('-password -refreshToken').exec();
    if (!users || users.length === 0) {
      throw new NotFoundError('No users found');
    }
    return users;
  }

  static async getUserById(id: string) {
    if (!id) throw new BadRequestError('User ID required');
    const user = await User.findById(id).select('-password -refreshToken').exec();
    if (!user) {
      throw new NotFoundError(`User ID ${id} not found`);
    }
    return user;
  }

  static async deleteUser(id: string) {
    if (!id) throw new BadRequestError('User ID required');
    const user = await User.findById(id).exec();
    if (!user) {
      throw new NotFoundError(`User ID ${id} not found`);
    }
    return await user.deleteOne();
  }
}
