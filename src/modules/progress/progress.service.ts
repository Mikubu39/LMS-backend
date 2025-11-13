import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgress } from './database/lesson-progress.entity';
import { UpsertLessonProgressDto } from './dtos/upsert-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly repo: Repository<LessonProgress>,
  ) {}

  async upsert(userId: number, dto: UpsertLessonProgressDto) {
    const existing = await this.repo.findOne({ where: { userId, lessonId: dto.lessonId } });
    if (existing) {
      Object.assign(existing, {
        courseId: dto.courseId ?? existing.courseId,
        status: dto.status ?? existing.status,
        percentage: dto.percentage ?? existing.percentage,
        lastPosition: dto.lastPosition ?? existing.lastPosition,
      });
      return this.repo.save(existing);
    }
    const created = this.repo.create({ userId, ...dto });
    return this.repo.save(created);
  }
  async get(userId: number, filters: { courseId?: string; lessonId?: string }) { 
    const where: any = { userId };
    if (filters.courseId) where.courseId = filters.courseId;
    if (filters.lessonId) where.lessonId = filters.lessonId;
    return this.repo.find({ where, order: { updatedAt: 'DESC' } });
  }
}


