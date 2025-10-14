// src/modules/sessions/dtos/create-session.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsUUID()
  @IsNotEmpty({ message: 'courseId không được để trống' })
  courseId: string; // <-- Thuộc tính 'courseId' mà lỗi đang báo thiếu
}
