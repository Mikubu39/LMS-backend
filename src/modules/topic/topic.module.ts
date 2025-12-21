import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entity/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic]), // ⭐ BẮT BUỘC
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TypeOrmModule], // (không bắt buộc, nhưng nên có)
})
export class TopicModule {}
