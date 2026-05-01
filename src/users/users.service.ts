import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async updateUserRole(id: string, role: UserRole): Promise<User | null> {
    return await this.userModel.findByIdAndUpdate(
      id, 
      { role }, 
      { new: true }
    ).exec();
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<User | null> {
    return await this.userModel.findByIdAndUpdate(
      id, 
      { isActive }, 
      { new: true }
    ).exec();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return { deleted: !!result };
  }
}
