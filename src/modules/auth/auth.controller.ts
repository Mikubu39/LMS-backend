import { Controller, Post, Body, UseGuards, Get, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';

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
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công, trả về access token.' })
  @ApiResponse({ status: 401, description: 'Sai thông tin đăng nhập.' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

}