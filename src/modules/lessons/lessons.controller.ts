// src/modules/lessons/lessons.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // ParseIntPipe, // <-- Không cần dùng ParseIntPipe nữa
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Lesson } from './database/lesson.entity';

@ApiTags('lessons')
@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // ... (Hàm create và findAll không thay đổi)
  @Post()
  @ApiOperation({ summary: 'Tạo một bài học mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo bài học thành công.',
    type: Lesson,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả bài học' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: [Lesson] })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một bài học' })
  // --- THAY ĐỔI Ở ĐÂY ---
  @ApiParam({ name: 'id', description: 'ID (UUID) của bài học', type: String })
  @ApiResponse({ status: 200, description: 'Thành công.', type: Lesson })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học.' })
  findOne(@Param('id') id: string) {
    // <-- Bỏ ParseIntPipe và đổi kiểu thành string
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin một bài học' })
  // --- THAY ĐỔI Ở ĐÂY ---
  @ApiParam({ name: 'id', description: 'ID (UUID) của bài học', type: String })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công.',
    type: Lesson,
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học.' })
  update(
    @Param('id') id: string, // <-- Bỏ ParseIntPipe và đổi kiểu thành string
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một bài học' })
  // --- THAY ĐỔI Ở ĐÂY ---
  @ApiParam({ name: 'id', description: 'ID (UUID) của bài học', type: String })
  @ApiResponse({ status: 200, description: 'Xóa thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học.' })
  remove(@Param('id') id: string) {
    // <-- Bỏ ParseIntPipe và đổi kiểu thành string
    return this.lessonsService.remove(id);
  }
}
