import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entity/topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
  ) {}

  create(dto: CreateTopicDto) {
    const topic = this.topicRepo.create(dto);
    return this.topicRepo.save(topic);
  }

  findAll() {
    return this.topicRepo.find({
      relations: ['vocabularies'],
    });
  }
}
