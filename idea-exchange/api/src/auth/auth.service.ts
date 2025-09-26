import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { CredentialsDto } from './dtos/credentials.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configServce: ConfigService,
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

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwtService.signAsync({ userId: foundUser.id });
    const refreshToken = await this.jwtService.signAsync(
      {
        userId: foundUser.id,
      },
      {
        secret: this.configServce.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );

    const { password, ...userWithoutPass } = foundUser.toObject();

    return { ...userWithoutPass, token, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      //Verify refresh token
      const { userId } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configServce.get('REFRESH_TOKEN_SECRET'),
      });

      const foundUser = await this.usersService.findById(userId);

      const token = await this.jwtService.signAsync({ userId: foundUser.id });

      return { token };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }
}
