import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '12345678', description: 'Mật khẩu cũ' })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'newPassword@123', description: 'Mật khẩu mới' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}