import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './database/lesson.entity';
import { Session } from '../sessions/database/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Session])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
