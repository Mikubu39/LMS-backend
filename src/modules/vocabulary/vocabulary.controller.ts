import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyKanjiDto } from './dto/update-vocabulary-kanji.dto';

@ApiTags('Vocabulary')
@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabService: VocabularyService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo vocabulary + gán Kanji' })
  create(@Body() dto: CreateVocabularyDto) {
    return this.vocabService.create(dto);
  }

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Lấy vocabulary theo topic' })
  findByTopic(@Param('topicId') topicId: string) {
    return this.vocabService.findByTopic(topicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết vocabulary' })
  findOne(@Param('id') id: string) {
    return this.vocabService.findOne(id);
  }

  @Patch(':id/kanji')
  @ApiOperation({ summary: 'Cập nhật Kanji cho vocabulary' })
  updateKanji(
    @Param('id') id: string,
    @Body() dto: UpdateVocabularyKanjiDto,
  ) {
    return this.vocabService.updateKanji(id, dto.kanjiIds);
  }
}
