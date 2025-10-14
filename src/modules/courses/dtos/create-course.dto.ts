// src/modules/courses/dtos/create-course.dto.ts

import { ApiProperty } from '@nestjs/swagger'; // <--- 1. Import ApiProperty
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { CourseLevel } from '../database/courses.entity';

export class CreateCourseDto {
  // --- 2. Thêm decorator cho từng thuộc tính ---

  @ApiProperty({
    description: 'Tên của khóa học',
    example: 'Lập trình NestJS từ A đến Z',
  })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về nội dung khóa học',
    required: false, // <-- Rất quan trọng khi dùng @IsOptional()
    example: 'Khóa học này sẽ giúp bạn thành thạo NestJS trong 1 tháng.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Giá của khóa học (Để 0 nếu miễn phí)',
    required: false,
    example: 499000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Trình độ yêu cầu của khóa học',
    required: false,
    enum: CourseLevel, // <-- Giúp Swagger hiển thị các lựa chọn enum
    example: CourseLevel.BEGINNER, // Giả sử bạn có giá trị này trong enum
  })
  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;
}
