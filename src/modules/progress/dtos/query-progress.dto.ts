import { IsInt, IsOptional, IsUUID } from 'class-validator'; // <-- 1. Import IsUUID

export class QueryLessonProgressDto {
  @IsOptional()
  @IsUUID() // <-- 2. Thay @IsInt() bằng @IsUUID()
  courseId?: string; // <-- 3. Thay number bằng string

  @IsOptional()
  @IsUUID() // <-- 4. Thay @IsInt() bằng @IsUUID()
  lessonId?: string; // <-- 5. Thay number bằng string
}