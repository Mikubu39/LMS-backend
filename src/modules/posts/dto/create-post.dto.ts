import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePostDto {
@ApiProperty({ 
    description: 'Tiêu đề bài post'
   
  }) // <<< THÊM DÒNG NÀY
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Nội dung bài post',
  
  }) // <<< THÊM DÒNG NÀY
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Tên tác giả (Không bắt buộc)',
    required: false // <<< ĐÁNH DẤU LÀ KHÔNG BẮT BUỘC
  }) // <<< THÊM DÒNG NÀY
  @IsString()
  @IsOptional()
  @MaxLength(100)
  author?: string;
}


