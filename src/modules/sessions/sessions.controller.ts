// src/modules/sessions/sessions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth, // <-- 1. Import ApiBearerAuth
} from '@nestjs/swagger';
import { Session } from './database/session.entity';

@ApiTags('sessions')
@ApiBearerAuth() // <-- 2. Thêm vào đây để bảo vệ toàn bộ controller
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo một chương/buổi học mới' })
  @ApiResponse({ status: 201, description: 'Tạo thành công.', type: Session })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả các chương' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: [Session] })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một chương' })
  @ApiParam({ name: 'id', description: 'ID (UUID) của chương', type: String })
  @ApiResponse({ status: 200, description: 'Thành công.', type: Session })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chương này.' })
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin một chương' })
  @ApiParam({ name: 'id', description: 'ID (UUID) của chương', type: String })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công.',
    type: Session,
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chương này.' })
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một chương' })
  @ApiParam({ name: 'id', description: 'ID (UUID) của chương', type: String })
  @ApiResponse({ status: 200, description: 'Xóa thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chương này.' })
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }
}
