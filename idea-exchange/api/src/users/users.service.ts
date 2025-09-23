import { Injectable } from '@nestjs/common';
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

  async findAll() {
    return this.userModel.find({});
  }

  async findByEmail(email: string) {
    const foundUser = await this.userModel.findOne({ email });

    return foundUser;
  }
}
