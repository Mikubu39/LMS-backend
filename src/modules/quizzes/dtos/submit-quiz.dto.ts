import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested, IsUUID } from 'class-validator'; // <-- THÊM IsUUID
import { Type } from 'class-transformer';

class AnswerDto {
  @ApiProperty({ description: 'ID (uuid) của câu hỏi' })
  @IsNotEmpty()
  @IsUUID() // <-- SỬA
  question_id: string; // <-- SỬA

  @ApiProperty({ description: "Đáp án được chọn, ví dụ: 'a'", example: 'a' })
  @IsNotEmpty()
  @IsString()
  selected_answer: string;
}

export class SubmitQuizDto {
  @ApiProperty({ type: [AnswerDto], description: 'Danh sách các câu trả lời' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}