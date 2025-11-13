import { IsInt, IsOptional, IsEnum, Min, Max, IsUUID} from 'class-validator';
import { LessonStatus } from '../database/lesson-progress.entity';

export class UpsertLessonProgressDto {
  @IsUUID() // Thay @IsInt() bằng @IsUUID()
  courseId: string; // Thay number bằng string

  @IsUUID() // Thay @IsInt() bằng @IsUUID()
  lessonId: string; // Thay number bằng string

  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  percentage?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lastPosition?: number;
}