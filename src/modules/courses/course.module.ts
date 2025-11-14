// src/modules/courses/course.module.ts
import { Module } from '@nestjs/common';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './database/courses.entity';
import { User } from '../auth/database/user.entity'; // Import User

@Module({
  imports: [TypeOrmModule.forFeature([Course, User])], // Thêm User vào đây
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}