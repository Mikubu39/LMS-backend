import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, IsNull } from 'typeorm';
import { LessonProgress, LessonStatus } from './database/lesson-progress.entity';
import { UpsertLessonProgressDto } from './dtos/upsert-progress.dto';
import { QueryLessonProgressDto } from './dtos/query-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly repo: Repository<LessonProgress>,
  ) {}

  async upsert(dto: UpsertLessonProgressDto) {
    const {
      userId,
      courseId,
      sessionId,
      lessonId,
      lessonItemId,
      classId,
      status,
      percentage,
      lastPosition,
    } = dto;

    const where: FindOptionsWhere<LessonProgress> = {
      userId,
      lessonItemId,
    };

    if (classId) {
      where.classId = classId;
    } else {
      where.classId = IsNull();
    }

    const existing = await this.repo.findOne({ where });

    if (existing) {
      existing.courseId = courseId;
      existing.sessionId = sessionId;
      existing.lessonId = lessonId;
      existing.lessonItemId = lessonItemId;
      existing.classId = classId ?? null;
      if (status) {
        existing.status = status;
      }
      if (typeof percentage === 'number') {
        existing.percentage = percentage;
      }
      if (typeof lastPosition === 'number') {
        existing.lastPosition = lastPosition;
      }
      return this.repo.save(existing);
    }

    const created = this.repo.create({
      userId,
      courseId,
      sessionId,
      lessonId,
      lessonItemId,
      classId: classId ?? null,
      status: status ?? LessonStatus.IN_PROGRESS,
      percentage: percentage ?? 0,
      lastPosition: lastPosition ?? null,
    });
    return this.repo.save(created);
  }

  async get(query: QueryLessonProgressDto) {
    const { userId, courseId, sessionId, lessonId, lessonItemId, classId } = query;

    const where: FindOptionsWhere<LessonProgress> = { userId };

    if (courseId) {
      where.courseId = courseId;
    }
    if (sessionId) {
      where.sessionId = sessionId;
    }
    if (lessonId) {
      where.lessonId = lessonId;
    }
    if (lessonItemId) {
      where.lessonItemId = lessonItemId;
    }
    if (typeof classId !== 'undefined') {
      where.classId = classId ?? null;
    }

    return this.repo.find({ where, order: { updatedAt: 'DESC' } });
  }
}