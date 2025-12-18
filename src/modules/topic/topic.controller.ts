import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';

@ApiTags('Topic')
@Controller('topics')
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo topic mới' })
  create(@Body() dto: CreateTopicDto) {
    return this.topicService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách topic' })
  findAll() {
    return this.topicService.findAll();
  }
}
