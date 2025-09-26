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
import { registerHooks } from 'module';

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
    const refreshToken = await this.createRefreshToken(foundUser.id);

    await this.usersService.saveRefreshToken(foundUser.id, refreshToken);

    const { password, refreshTokens, ...userWithoutPass } =
      foundUser.toObject();

    return { ...userWithoutPass, token, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      //Verify refresh token
      const { userId } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configServce.get('REFRESH_TOKEN_SECRET'),
      });

      const foundUser = await this.usersService.findById(userId);

      //Check if refresh token exists in refresh tokens array in users document
      const tokenExists = foundUser.refreshTokens.some(
        (token) => token === refreshToken,
      );

      if (!tokenExists) throw new Error("Token doesn't exist");

      await this.usersService.deleteRefreshToken(foundUser.id, refreshToken);

      const token = await this.jwtService.signAsync({ userId: foundUser.id });
      const newRefreshToken = await this.createRefreshToken(foundUser.id);

      await this.usersService.saveRefreshToken(foundUser.id, newRefreshToken);

      return { token, refreshToken: newRefreshToken };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }

  async logoutUser(refreshToken: string) {
    try {
      const { userId } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configServce.get('REFRESH_TOKEN_SECRET'),
      });

      await this.usersService.deleteRefreshToken(userId, refreshToken);
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Couldn't logout user");
    }
  }

  private async createRefreshToken(userId: string) {
    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configServce.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );

    return refreshToken;
  }
}
