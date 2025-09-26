import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(3, 40)
  title: string;

  @IsString()
  @Length(3, 240)
  body: string;
}
