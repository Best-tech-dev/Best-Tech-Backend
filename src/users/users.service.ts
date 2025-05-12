import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../identity/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Create new user profile
  // POST /
//   async createUserProfile(createUserDto: CreateUserDto): Promise<User> {
//     // Create user profile without authentication concerns
//     const newUser = new this.userModel(createUserDto);
//     return newUser.save();
//   }

//   async findUserById(userId: string): Promise<any> {
//     const user = await this.userModel.findById(userId).exec();
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
//     return user;
//   }

//   async updateUserProfile(
//     userId: string, 
//     updateUserDto: UpdateUserDto
//   ): Promise<any> {
//     return this.userModel.findByIdAndUpdate(
//       userId, 
//       updateUserDto, 
//       { new: true }
//     ).exec();
//   }

//   async findUserByEmail(email: string): Promise<any> {
//     return this.userModel.findOne({ email }).exec();
//   }

//   // New method to check if email exists (for Identity module)
//   async isEmailUnique(email: string): Promise<any> {
//     const existingUser = await this.userModel.findOne({ email }).exec();
//     return !existingUser;
//   }
}