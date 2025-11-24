import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ClassStatus } from '../database/class.entity';

export class CreateClassDto {
  @ApiProperty({ example: 'NODE-K01' })
  @IsNotEmpty() @IsString()
  code: string;

  @ApiProperty({ example: 'NodeJS Basic K01' })
  @IsNotEmpty() @IsString()
  name: string;

  @ApiProperty() @IsUUID()
  course_id: string;

  @ApiProperty() @IsUUID()
  teacher_id: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  schedule?: string;

  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1)
  max_students?: number;

  @ApiPropertyOptional({ enum: ClassStatus }) 
  @IsOptional() @IsEnum(ClassStatus)
  status?: ClassStatus;
}