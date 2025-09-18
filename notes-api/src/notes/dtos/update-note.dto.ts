import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @Length(3, 30)
  @IsOptional()
  author: string;

  @IsString()
  @Length(3, 240)
  @IsOptional()
  text: string;

  @IsString()
  @IsOptional()
  date: string;
}
