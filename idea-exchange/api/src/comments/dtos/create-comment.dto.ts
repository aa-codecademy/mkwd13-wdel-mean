import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(3, 140)
  body: string;

  @IsString()
  postId: string;
}
