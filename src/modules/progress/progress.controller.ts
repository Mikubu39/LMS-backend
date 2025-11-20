import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpsertLessonProgressDto } from './dtos/upsert-progress.dto';
import { QueryLessonProgressDto } from './dtos/query-progress.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
@ApiTags('09. Progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly service: ProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Cập nhật/tạo mới tiến độ học' })
  @ApiBody({ type: UpsertLessonProgressDto })
  async upsert(@Body('userId') userId: number, @Body() dto: UpsertLessonProgressDto) {
    return this.service.upsert(Number(userId), dto);
  }
  @Get()
  @ApiOperation({ summary: 'Lấy tiến độ học' })
  async get(@Query('userId') userId: number, @Query() q: QueryLessonProgressDto) {
    return this.service.get(Number(userId), q);
  }
}


