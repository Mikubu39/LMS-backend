import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../auth/database/user.entity';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.TEACHER })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}