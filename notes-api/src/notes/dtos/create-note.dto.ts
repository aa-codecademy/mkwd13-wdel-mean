import { IsString, Length } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @Length(3, 30)
  author: string;

  @IsString()
  @Length(3, 240)
  text: string;

  @IsString()
  date: string;
}
