import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpsertLessonProgressDto } from './dtos/upsert-progress.dto';
import { QueryLessonProgressDto } from './dtos/query-progress.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('09. Progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly service: ProgressService) {}

  @Post()
  async upsert(@Body('userId') userId: number, @Body() dto: UpsertLessonProgressDto) {
    return this.service.upsert(Number(userId), dto);
  }
  @Get()
  async get(@Query('userId') userId: number, @Query() q: QueryLessonProgressDto) {
    return this.service.get(Number(userId), q);
  }
}


