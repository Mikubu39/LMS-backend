// src/modules/lessons/dtos/create-lesson.dto.ts

import { ApiProperty } from '@nestjs/swagger'; // <-- 1. Import
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { LessonType } from '../database/lesson.entity';

export class CreateLessonDto {
  @ApiProperty({
    description: 'Tiêu đề của bài học',
    example: 'Giới thiệu về NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Thời lượng của bài học (tính bằng phút)',
    required: false,
    example: 15,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'Thứ tự hiển thị của bài học trong một chương',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({
    description: 'Loại bài học',
    required: false,
    enum: LessonType,
    example: LessonType.VIDEO,
  })
  @IsEnum(LessonType)
  @IsOptional()
  type?: LessonType;

  @ApiProperty({
    description: 'ID của buổi học mà bài học thuộc về',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  sessionId: string;
}
