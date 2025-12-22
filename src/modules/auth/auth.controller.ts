// src/modules/auth/auth.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  HttpCode, 
  HttpStatus, 
  Request 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { ChangePasswordDto } from './dtos/change-password.dto'; // Import DTO
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtRefreshGuard } from 'src/shared/guard/jwt-refresh.guard'; 
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard chuẩn cho Access Token

@ApiTags('01. Auth')
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
  @ApiResponse({ 
    status: 200, 
    description: 'Đăng nhập thành công, trả về access_token và refresh_token.' 
  })
  @ApiResponse({ status: 401, description: 'Sai thông tin đăng nhập.' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @UseGuards(JwtRefreshGuard) 
  @Post('refresh')
  @ApiBearerAuth('JWT-auth') 
  @ApiOperation({ summary: 'Làm mới Access Token' })
  @ApiResponse({ status: 200, description: 'Trả về access_token mới.' })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ.' })
  refreshToken(@Request() req) {
    const user = req.user; 
    return this.authService.refreshToken(user);
  }

 
}