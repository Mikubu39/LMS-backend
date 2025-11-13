import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonVideoService } from './lesson-video.service';
import { LessonVideoController } from './lesson-video.controller';
import { LessonVideo } from './entities/lesson-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonVideo])],
  controllers: [LessonVideoController],
  providers: [LessonVideoService],
})
export class LessonVideoModule {}
