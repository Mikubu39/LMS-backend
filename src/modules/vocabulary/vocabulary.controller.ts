import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto'; // File mới tạo ở trên
import { UpdateVocabularyKanjiDto } from './dto/update-vocabulary-kanji.dto';

// Import bảo mật
import { RolesGuard } from '../../shared/guard/roles.guard'; //
import { Roles } from '../../shared/decorators/roles.decorator'; //
import { UserRole } from 'src/constant/enum'; //

@ApiTags('Vocabulary')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabService: VocabularyService) {}


  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Tạo vocabulary mới (Admin, Teacher)' })
  create(@Body() dto: CreateVocabularyDto) {
    return this.vocabService.create(dto);
  }


  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Lấy danh sách từ vựng theo Topic' })
  findByTopic(@Param('topicId', ParseUUIDPipe) topicId: string) {
    return this.vocabService.findByTopic(topicId);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết vocabulary' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vocabService.findOne(id);
  }

  
  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin từ vựng (Admin, Teacher)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVocabularyDto,
  ) {
    return this.vocabService.update(id, dto);
  }

 
  @Patch(':id/kanji')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cập nhật danh sách Kanji cho từ vựng' })
  updateKanji(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVocabularyKanjiDto,
  ) {
    return this.vocabService.updateKanji(id, dto.kanjiIds);
  }

  
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Xóa VĨNH VIỄN từ vựng (Admin, Teacher)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vocabService.remove(id);
  }
}