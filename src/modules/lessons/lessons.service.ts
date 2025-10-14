// src/modules/lessons/lessons.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../sessions/database/session.entity';
import { Repository } from 'typeorm';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { Lesson } from './database/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const { sessionId, ...rest } = createLessonDto;

    const session = await this.sessionRepository.findOneBy({ id: sessionId });
    if (!session) {
      throw new NotFoundException(
        `Không tìm thấy chương học với ID: ${sessionId}`,
      );
    }

    const newLesson = this.lessonRepository.create({
      ...rest,
      session: session,
    });

    return this.lessonRepository.save(newLesson);
  }

  findAll(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  // --- THAY ĐỔI Ở ĐÂY ---
  async findOne(id: string): Promise<Lesson> {
    // <-- Đổi id: number thành id: string
    const lesson = await this.lessonRepository.findOneBy({ id });
    if (!lesson) {
      throw new NotFoundException(`Không tìm thấy bài học với ID #${id}`);
    }
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    // <-- Đổi id: number thành id: string
    const lesson = await this.lessonRepository.preload({
      id: id,
      ...updateLessonDto,
    });
    if (!lesson) {
      throw new NotFoundException(`Không tìm thấy bài học với ID #${id}`);
    }
    return this.lessonRepository.save(lesson);
  }

  async remove(id: string): Promise<Lesson> {
    // <-- Đổi id: number thành id: string
    const lesson = await this.findOne(id);
    return this.lessonRepository.remove(lesson);
  }
}
