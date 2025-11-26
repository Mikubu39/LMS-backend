import { Module } from '@nestjs/common';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './database/courses.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Course])], // Đã xóa User khỏi mảng này
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}