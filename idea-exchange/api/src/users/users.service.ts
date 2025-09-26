import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);

    const createdUser = await newUser.save();

    return createdUser;
  }

  async findByEmail(email: string) {
    const foundUser = await this.userModel.findOne({ email });

    return foundUser;
  }

  async findById(id: string) {
    try {
      const foundUser = await this.userModel.findById(id);

      if (!foundUser) throw new Error();

      return foundUser;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    const user = await this.findById(userId);

    user.refreshTokens.push(refreshToken);

    await user.save();
  }

  async deleteRefreshToken(userId: string, refreshToken: string) {
    const user = await this.findById(userId);

    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken,
    );

    await user.save();
  }
}
