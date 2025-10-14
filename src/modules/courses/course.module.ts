// src/modules/courses/course.module.ts
import { Module } from '@nestjs/common';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './database/courses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])], // <-- Thêm dòng này
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
