// src/modules/users/controllers/student.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch, // <<< SỬA ĐỔI: Dùng Patch thay cho Put
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentService } from '../services/student.service';
import { CreateStudentDto } from '../dtos/request/create-student.dto';
import { UpdateStudentDto } from '../dtos/request/update-student.dto';
import { UpdateProfileDto } from '../dtos/request/update-profile.dto';
import { ChangePasswordDto } from '../dtos/request/change-password.dto';
import { SearchStudentDto } from '../dtos/request/search-student.dto';
import { StudentResponseDto } from '../dtos/response/student-response.dto';
import { PaginatedStudentsResponseDto } from '../dtos/response/paginated-students-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../shared/guard/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../../../shared//types';
import { UserRole } from 'src/constant/enum';

@ApiTags('02. Users (Admin & Profile)')
@Controller('users') // <<< SỬA ĐỔI: Thêm prefix chung 'users'
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // =============================================
  // Admin: Quản lý Users (Prefix: /users/admin)
  // =============================================

  @Post('admin') // <<< SỬA ĐỔI: Route gọn hơn
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin tạo user mới (student/teacher)' })
  @ApiBody({
    type: CreateStudentDto,
    examples: { /* ... (giữ nguyên) ... */ },
  })
  @ApiResponse({ status: 201, description: 'Tạo user thành công', type: StudentResponseDto })
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentService.create(createStudentDto);
  }

  @Get('admin') // <<< SỬA ĐỔI: Route gọn hơn
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin lấy danh sách users (tìm kiếm + phân trang)' })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm kiếm chung (email, tên, sđt)' }) // Cập nhật description
  @ApiQuery({ name: 'email', required: false, description: 'Lọc theo email' })
  @ApiQuery({ name: 'full_name', required: false, description: 'Lọc theo tên' }) // Thêm ApiQuery

  // --- THÊM MỚI TẠI ĐÂY ---
  @ApiQuery({ 
    name: 'role', 
    required: false, 
    enum: UserRole, 
    description: 'Lọc theo vai trò' 
  })
  // --- KẾT THÚC THÊM MỚI ---

  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 }) // Thêm ApiQuery
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }) // Thêm ApiQuery
  @ApiResponse({ status: 200, type: PaginatedStudentsResponseDto })
  async findAll(
    @Query() searchDto: SearchStudentDto, // DTO này giờ đã chứa 'role'
  ): Promise<PaginatedStudentsResponseDto> {
    return this.studentService.findAll(searchDto);
  }

  @Get('admin/:id') // <<< SỬA ĐỔI: Route gọn hơn
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin xem chi tiết một user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, type: StudentResponseDto })
  @ApiResponse({ status: 404, description: 'User không tồn tại' })
  async findOne(@Param('id') id: string): Promise<StudentResponseDto> {
    return this.studentService.findOne(id);
  }

  @Patch('admin/:id') // <<< SỬA ĐỔI: Dùng PATCH và route gọn hơn
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin cập nhật thông tin user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateStudentDto, /* ... */ })
  @ApiResponse({ status: 200, type: StudentResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete('admin/:id') // <<< SỬA ĐỔI: Route gọn hơn
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin xóa một user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'Xóa thành công' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.studentService.delete(id);
  }

  // ==================================================
  // User: Quản lý Profile cá nhân (Prefix: /users/profile)
  // ==================================================

  @Get('profile/me') // <<< THÊM MỚI
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xem thông tin cá nhân (profile) của tôi' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công', type: StudentResponseDto })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  async getMyProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<StudentResponseDto> {
    const userId = req.user!.user_id;
    return this.studentService.findOne(userId); // Tái sử dụng hàm findOne
  }

  @Patch('profile/me') // <<< SỬA ĐỔI: Dùng PATCH và route 'profile/me'
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân (profile) của tôi' })
  @ApiBody({ type: UpdateProfileDto, /* ... */ })
  @ApiResponse({ status: 200, type: StudentResponseDto })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<StudentResponseDto> {
    const userId = req.user!.user_id;
    return this.studentService.updateProfile(userId, updateProfileDto);
  }

  @Patch('profile/password') // <<< SỬA ĐỔI: Dùng PATCH
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tự đổi mật khẩu' })
  @ApiBody({ type: ChangePasswordDto, /* ... */ })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công' })
  @ApiResponse({ status: 400, description: 'Mật khẩu hiện tại không đúng' })
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const userId = req.user!.user_id;
    return this.studentService.changePassword(userId, changePasswordDto);
  }
}