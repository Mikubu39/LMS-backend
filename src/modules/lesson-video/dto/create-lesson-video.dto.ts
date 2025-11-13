import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateLessonVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
