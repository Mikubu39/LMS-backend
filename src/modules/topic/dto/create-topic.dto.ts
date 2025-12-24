import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ example: 'Chào hỏi cơ bản' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Topic tiếng Nhật N5' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 'N5', enum: ['N5', 'N4', 'N3', 'N2', 'N1'] })
  @IsString()
  @IsNotEmpty()
  level: string;
}
