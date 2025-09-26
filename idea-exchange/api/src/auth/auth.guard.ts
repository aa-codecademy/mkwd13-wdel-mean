import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      //Extract token from request header
      const request = context.switchToHttp().getRequest();

      const token = request.headers['authorization']?.split(' ')[1];

      if (!token) return false;

      const { userId } = await this.jwtService.verifyAsync(token);

      const foundUser = await this.usersService.findById(userId);

      console.log(foundUser);

      request.user = foundUser;

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
