// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './jwt-refresh.strategy'; // <-- THÊM IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'), 
        },
      }),
      inject: [ConfigService], 
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  // Thêm JwtRefreshStrategy vào providers
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}