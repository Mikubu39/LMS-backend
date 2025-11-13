// src/modules/courses/course.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards, // <-- Cần thêm UseGuards
} from '@nestjs/common';
import { CoursesService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Course } from './database/courses.entity';

// --- Import Auth & Roles ---
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../shared/guard/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/constant/enum';

@ApiTags('03. Courses')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Bảo vệ toàn bộ Controller
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // --- CHỨC NĂNG GHI (Chỉ Admin & Teacher) ---

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER) // <-- Chỉ Admin/Teacher được tạo
  @ApiOperation({ summary: 'Tạo một khóa học mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo khóa học thành công.',
    type: Course,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu gửi lên không hợp lệ.' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  // --- CHỨC NĂNG XEM (Admin, Teacher & Student) ---

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT) // <-- Student được xem danh sách
  @ApiOperation({ summary: 'Lấy danh sách khóa học (có phân trang)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Số trang',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng trên một trang',
  })
  @ApiResponse({ status: 200, description: 'Thành công.', type: [Course] })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.coursesService.findAll({ page, limit });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT) // <-- Student được xem chi tiết
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một khóa học' })
  @ApiParam({ name: 'id', description: 'ID (UUID) của khóa học', type: String })
  @ApiResponse({ status: 200, description: 'Thành công.', type: Course })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học.' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  // --- CHỨC NĂNG SỬA/XÓA (Chỉ Admin & Teacher) ---

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER) // <-- Chỉ Admin/Teacher được sửa
  @ApiOperation({ summary: 'Cập nhật thông tin khóa học' })
  @ApiParam({ name: 'id', description: 'ID (UUID) của khóa học', type: String })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công.',
    type: Course,
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học.' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER) // <-- Chỉ Admin/Teacher được xóa
  @ApiOperation({ summary: 'Xóa một khóa học' })
  @ApiParam({ name: 'id', description: 'ID (UUID) của khóa học', type: String })
  @ApiResponse({ status: 200, description: 'Xóa thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học.' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập.' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}