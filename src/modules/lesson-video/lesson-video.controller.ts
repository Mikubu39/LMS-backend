import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LessonVideoService } from './lesson-video.service';
import { CreateLessonVideoDto } from './dto/create-lesson-video.dto';
import { UpdateLessonVideoDto } from './dto/update-lesson-video.dto';

@ApiTags('06. Lesson Videos')
@Controller('lesson-videos')
export class LessonVideoController {
  constructor(private readonly lessonVideoService: LessonVideoService) {}

  @Post()
  create(@Body() dto: CreateLessonVideoDto) {
    return this.lessonVideoService.create(dto);
  }

  @Get()
  findAll() {
    return this.lessonVideoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonVideoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLessonVideoDto) {
    return this.lessonVideoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonVideoService.remove(id);
  }
}
