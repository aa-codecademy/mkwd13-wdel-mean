import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { CredentialsDto } from './dtos/credentials.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    //call auth service here
    return this.authService.registerUser(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginUser(@Body() credentialsDto: CredentialsDto) {
    return this.authService.loginUser(credentialsDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logoutUser(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logoutUser(refreshTokenDto.refreshToken);
  }
}
