import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @ApiProperty({ description: 'ID của câu hỏi' })
  @IsNotEmpty()
  @IsNumber()
  question_id: number;

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