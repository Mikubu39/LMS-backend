// src/modules/lessons/lessons.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, // <-- Thêm UseGuards
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

// --- Import các phần xác thực và phân quyền ---
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../shared/guard/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/constant/enum';

@ApiTags('05. Lessons')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Kích hoạt bảo vệ cho toàn bộ Controller
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // --- CHỨC NĂNG GHI (Chỉ Admin & Teacher) ---

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER) // <-- Chỉ Admin/Teacher được tạo
  @ApiOperation({ summary: 'Tạo một bài học mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo bài học thành công.',
    type: Lesson,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  // --- CHỨC NĂNG XEM (Admin, Teacher & Student) ---

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT) // <-- Student được xem danh sách
  @ApiOperation({ summary: 'Lấy danh sách tất cả bài học' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: [Lesson] })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT) // <-- Student được xem chi tiết
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một bài học' })
  @ApiParam({ name: 'id', description: 'ID (UUID) của bài học', type: String })
  @ApiResponse({ status: 200, description: 'Thành công.', type: Lesson })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học.' })
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  // --- CHỨC NĂNG SỬA/XÓA (Chỉ Admin & Teacher) ---

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER) // <-- Chỉ Admin/Teacher được sửa
  @ApiOperation({ summary: 'Cập nhật thông tin một bài học' })
  @ApiParam({ name: 'id', description: 'ID (UUID) của bài học', type: String })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công.',
    type: Lesson,
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học.' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER) // <-- Chỉ Admin/Teacher được xóa
  @ApiOperation({ summary: 'Xóa một bài học' })
  @ApiParam({ name: 'id', description: 'ID (UUID) của bài học', type: String })
  @ApiResponse({ status: 200, description: 'Xóa thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học.' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}