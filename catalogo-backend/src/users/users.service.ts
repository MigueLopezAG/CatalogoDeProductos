import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) public userModel: Model<User>) {}

  /**Function to find a user by the email
   * @params email
  */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**Function to create a new user
    @params email
    @params password
    @params role
  */ 
  async create(user: Partial<User>): Promise<User> {
    const created = new this.userModel(user);
    return created.save();
  }

}
