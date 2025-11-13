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
@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // Admin: CRUD học viên
  @Post('admin/students')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo học viên mới' })
  @ApiBody({
    type: CreateStudentDto,
    examples: {
      example1: {
        value: {
          email: 'student1@example.com',
          password: 'password123',
          full_name: 'Nguyễn Văn A',
          phone: '0123456789',
          address: 'Hà Nội',
          avatar: 'https://example.com/avatar.jpg',
          role: 'student',
          isActive: true,
          dateOfBirth: '2000-01-01',
          gender: 'male',
        },
        description: 'Tạo học viên với đầy đủ thông tin',
      },
      example2: {
        value: {
          email: 'student2@example.com',
          password: 'password123',
          fullName: 'Trần Thị B',
        },
        description: 'Tạo học viên với thông tin tối thiểu',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Tạo học viên thành công', type: StudentResponseDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentService.create(createStudentDto);
  }

  @Get('admin/students')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Danh sách học viên (tìm kiếm + phân trang)' })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm kiếm theo email, fullName, phone' })
  @ApiQuery({ name: 'email', required: false, description: 'Lọc theo email' })
  @ApiQuery({ name: 'fullName', required: false, description: 'Lọc theo tên' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công', type: PaginatedStudentsResponseDto })
  async findAll(
    @Query() searchDto: SearchStudentDto,
  ): Promise<PaginatedStudentsResponseDto> {
    return this.studentService.findAll(searchDto);
  }

  @Get('admin/students/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Chi tiết học viên' })
  @ApiParam({ name: 'id', description: 'ID học viên' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công', type: StudentResponseDto })
  @ApiResponse({ status: 404, description: 'Học viên không tồn tại' })
  async findOne(@Param('id') id: string): Promise<StudentResponseDto> {
    return this.studentService.findOne(id);
  }

  @Put('admin/students/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin học viên' })
  @ApiParam({ name: 'id', description: 'ID học viên' })
  @ApiBody({
    type: UpdateStudentDto,
    examples: {
      example1: {
        value: {
          fullName: 'Nguyễn Văn B',
          phone: '0987654321',
          address: 'Hồ Chí Minh',
          isActive: false,
        },
        description: 'Cập nhật thông tin học viên',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: StudentResponseDto })
  @ApiResponse({ status: 404, description: 'Học viên không tồn tại' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete('admin/students/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa học viên' })
  @ApiParam({ name: 'id', description: 'ID học viên' })
  @ApiResponse({ status: 204, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Học viên không tồn tại' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.studentService.delete(id);
  }

  // Student: Quản lý thông tin cá nhân
  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  @ApiBody({
    type: UpdateProfileDto,
    examples: {
      example1: {
        value: {
          fullName: 'Nguyễn Văn C',
          phone: '0123456789',
          address: 'Đà Nẵng',
          avatar: 'https://example.com/new-avatar.jpg',
          dateOfBirth: '1995-05-15',
          gender: 'female',
        },
        description: 'Cập nhật thông tin cá nhân',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: StudentResponseDto })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<StudentResponseDto> {
    const userId = req.user!.user_id;
    return this.studentService.updateProfile(userId, updateProfileDto);
  }

  @Put('profile/password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @ApiBody({
    type: ChangePasswordDto,
    examples: {
      example1: {
        value: {
          currentPassword: 'oldPassword123',
          newPassword: 'newPassword123',
        },
        description: 'Đổi mật khẩu',
      },
    },
  })
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

