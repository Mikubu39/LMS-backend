import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// DTO này gần giống CreateQuestionDto cũ, nhưng không có quiz_id
export class CreateBankQuestionDto {
  @ApiProperty() @IsNotEmpty() @IsString() question_text: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiProperty() @IsNotEmpty() @IsString() option_a: string;
  @ApiProperty() @IsNotEmpty() @IsString() option_b: string;
  @ApiProperty() @IsNotEmpty() @IsString() option_c: string;
  @ApiProperty() @IsNotEmpty() @IsString() option_d: string;
  @ApiProperty({ example: 'a' }) @IsNotEmpty() @IsString() @IsIn(['a', 'b', 'c', 'd']) correct_answer: string;
}

export class UpdateBankQuestionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() question_text?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() option_a?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() option_b?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() option_c?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() option_d?: string;
  @ApiPropertyOptional({ example: 'a' }) @IsOptional() @IsString() @IsIn(['a', 'b', 'c', 'd']) correct_answer?: string;
}