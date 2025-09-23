import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(5, 30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;
}
