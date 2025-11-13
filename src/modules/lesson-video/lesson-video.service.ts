import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonVideo } from './entities/lesson-video.entity';
import { CreateLessonVideoDto } from './dto/create-lesson-video.dto';
import { UpdateLessonVideoDto } from './dto/update-lesson-video.dto';

@Injectable()
export class LessonVideoService {
  constructor(
    @InjectRepository(LessonVideo)
    private readonly lessonVideoRepo: Repository<LessonVideo>,
  ) {}

  async create(dto: CreateLessonVideoDto) {
    const video = this.lessonVideoRepo.create(dto);
    return await this.lessonVideoRepo.save(video);
  }

  async findAll() {
    return await this.lessonVideoRepo.find();
  }

  async findOne(id: number) {
    const video = await this.lessonVideoRepo.findOne({ where: { id } });
    if (!video) throw new NotFoundException('Video không tồn tại');
    return video;
  }

  async update(id: number, dto: UpdateLessonVideoDto) {
    const video = await this.findOne(id);
    Object.assign(video, dto);
    return await this.lessonVideoRepo.save(video);
  }

  async remove(id: number) {
    const video = await this.findOne(id);
    return await this.lessonVideoRepo.remove(video);
  }
}
