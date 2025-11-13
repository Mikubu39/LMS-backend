import { IsString, IsUrl, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ 
    example: 'https://github.com/username/project-repo.git', 
    description: 'Link Git repository' 
  })
  @IsUrl({}, { message: 'Link Git không hợp lệ' })
  gitLink: string;

  @ApiPropertyOptional({ 
    example: 'Đây là bài tập về API NestJS với TypeORM và MySQL', 
    description: 'Mô tả về bài nộp', 
    minLength: 10 
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Mô tả phải có ít nhất 10 ký tự' })
  description?: string;
}

