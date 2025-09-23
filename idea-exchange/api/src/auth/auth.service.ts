import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { CredentialsDto } from './dtos/credentials.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) throw new BadRequestException('User already exists!');

    const createdUser = await this.usersService.create(createUserDto);
    console.log(createdUser);
  }

  async loginUser(credentialsDto: CredentialsDto) {
    const foundUser = await this.usersService.findByEmail(credentialsDto.email);

    if (!foundUser) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await compare(
      credentialsDto.password,
      foundUser.password,
    );

    const token = await this.jwtService.signAsync({ userId: foundUser.id });

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const { password, ...userWithoutPass } = foundUser.toObject();

    return { ...userWithoutPass, token };
  }
}
