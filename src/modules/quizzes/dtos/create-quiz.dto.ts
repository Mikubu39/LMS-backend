import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

class CreateQuestionDto {
  @ApiProperty() @IsNotEmpty() @IsString() question_text: string;
  @ApiProperty() @IsNotEmpty() @IsString() option_a: string;
  @ApiProperty() @IsNotEmpty() @IsString() option_b: string;
  @ApiProperty() @IsNotEmpty() @IsString() option_c: string;
  @ApiProperty() @IsNotEmpty() @IsString() option_d: string;
  @ApiProperty({ example: 'a', description: "Đáp án đúng, phải là 'a', 'b', 'c', hoặc 'd'"})
  @IsNotEmpty() @IsString() @IsIn(['a', 'b', 'c', 'd']) correct_answer: string;
}

export class CreateQuizDto {
  @ApiProperty() @IsNotEmpty() @IsString() title: string;
  @ApiProperty() @IsNotEmpty() @IsNumber() @Min(1) duration: number;
  @ApiProperty() @IsNotEmpty() @IsNumber() lesson_id: number;

  @ApiProperty({ type: [CreateQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}