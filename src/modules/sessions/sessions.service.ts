// src/modules/sessions/sessions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../courses/database/courses.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dtos/create-session.dto';
import { Session } from './database/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const { courseId, ...rest } = createSessionDto;

    // Tìm xem khóa học có tồn tại không
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException(
        `Không tìm thấy khóa học với ID: ${courseId}`,
      );
    }

    // Nếu có, tạo session mới và gán khóa học đó vào
    const newSession = this.sessionRepository.create({
      ...rest,
      course: course,
    });

    return this.sessionRepository.save(newSession);
  }

  findAll(): Promise<Session[]> {
    return this.sessionRepository.find({ relations: ['course'] });
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!session) {
      throw new NotFoundException(`Không tìm thấy chương với ID #${id}`);
    }
    return session;
  }

  async update(id: string, updateSessionDto: any): Promise<Session> {
    const session = await this.sessionRepository.preload({ id, ...updateSessionDto });
    if (!session) {
      throw new NotFoundException(`Không tìm thấy chương với ID #${id}`);
    }
    return this.sessionRepository.save(session);
  }

  async remove(id: string): Promise<Session> {
    const session = await this.findOne(id);
    return this.sessionRepository.remove(session);
  }
}
