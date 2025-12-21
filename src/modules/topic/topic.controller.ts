import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Topic')
@Controller('topics')
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
  ) {}

  // 🔍 LIST + SEARCH + PAGINATION (PUBLIC)
  @Get()
  @ApiOperation({
    summary:
      'Danh sách topic (search + phân trang)',
  })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({
    name: 'level',
    required: false,
    example: 'N5',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  findAll(
    @Query('q') q?: string,
    @Query('level') level?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.topicService.findAll({
      q,
      level,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
  }

  // 🔎 DETAIL (PUBLIC)
  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết topic',
  })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.topicService.findOne(id);
  }

  // ➕ CREATE (ADMIN)
  @Post()
  @ApiBearerAuth()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'ADMIN tạo topic',
  })
  create(@Body() dto: CreateTopicDto) {
    return this.topicService.create(dto);
  }

  // ✏️ UPDATE (ADMIN)
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'ADMIN cập nhật topic',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTopicDto,
  ) {
    return this.topicService.update(
      id,
      dto,
    );
  }

  // 🧹 SOFT DELETE (ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'ADMIN xóa topic (soft)',
  })
  remove(@Param('id') id: string) {
    return this.topicService.remove(id);
  }
}
