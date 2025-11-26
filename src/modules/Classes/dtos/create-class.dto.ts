import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsArray, IsUUID, IsDateString } from 'class-validator';
import { ClassStatus } from '../database/class.entity';

export class CreateClassDto {
  @ApiProperty({ example: 'NODE-K01' })
  @IsNotEmpty() @IsString()
  code: string;

  @ApiProperty({ example: 'NodeJS Basic K01' })
  @IsNotEmpty() @IsString()
  name: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  courseIds: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  teacherIds: string[];

  // 👇 BỎ SCHEDULE, MAX_STUDENTS (Hoặc để optional nếu muốn giữ tương thích cũ)
  
  // 👇 THÊM NGÀY BẮT ĐẦU & KẾT THÚC
  @ApiPropertyOptional({ example: '2025-10-20' }) 
  @IsOptional() 
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ example: '2026-01-20' }) 
  @IsOptional() 
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ enum: ClassStatus }) 
  @IsOptional() @IsEnum(ClassStatus)
  status?: ClassStatus;
}