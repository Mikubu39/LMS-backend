import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVocabularyKanjiDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  kanjiIds: number[];
}
