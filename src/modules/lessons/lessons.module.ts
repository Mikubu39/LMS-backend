import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './database/lesson.entity';
import { Session } from '../sessions/database/session.entity';
import { LessonItem } from './database/lesson-item.entity'; // <-- Import
import { Quiz } from '../quizzes/database/quiz.entity';       // <-- Import nếu cần check quiz tồn tại

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Session, LessonItem, Quiz]) // <-- Thêm LessonItem, Quiz
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}