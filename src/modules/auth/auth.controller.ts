import { Controller, Post, Body, UseGuards, Get, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { User } from './database/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forget-password.dto';

@ApiTags('1. Auth (Người dùng)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công.' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại.' })
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công, trả về access token.' })
  @ApiResponse({ status: 401, description: 'Sai thông tin đăng nhập.' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin người dùng.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@GetUser() user: User) {
    delete user.password;
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch('profile/update')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  updateProfile(@GetUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(user.user_id, updateProfileDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Patch('password/change')
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  changePassword(@GetUser() user: User, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(user.email, changePasswordDto);
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('password/forgot')
  @ApiOperation({ summary: 'Yêu cầu reset mật khẩu (Gửi email)' })
  @ApiResponse({ status: 200, description: 'Yêu cầu đã được xử lý.'})
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // Logic gửi email thực tế sẽ cần tích hợp một dịch vụ như Nodemailer hoặc SendGrid.
    // Đây là placeholder.
    console.log(`Password reset requested for: ${forgotPasswordDto.email}`);
    return { message: 'Nếu email tồn tại, một hướng dẫn reset mật khẩu đã được gửi đi.' };
  }
}