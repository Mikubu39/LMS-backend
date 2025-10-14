// src/modules/sessions/sessions.module.ts
import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './database/session.entity';
import { Course } from '../courses/database/courses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Course])], // <-- Đăng ký cả Session và Course
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
