import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionController } from './controllers/submission.controller';
import { SubmissionService } from './services/submission.service';
import { SubmissionRepository } from './repositories/submission.repository';
import { Submission } from './database/submission.entity';
import { LessonItem } from '../lessons/database/lesson-item.entity';
@Module({
  imports: [
    // 👇 THÊM LessonItem VÀO MẢNG NÀY
    TypeOrmModule.forFeature([Submission, LessonItem]) 
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService, SubmissionRepository],
  exports: [SubmissionService, SubmissionRepository],
})
export class SubmissionModule {}

