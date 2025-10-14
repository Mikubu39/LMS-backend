// src/modules/courses/course.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { Course } from './database/courses.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  findAll(paginationOptions: {
    page: number;
    limit: number;
  }): Promise<Course[]> {
    const { page, limit } = paginationOptions;
    return this.courseRepository.find({
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  // --- THAY ĐỔI Ở ĐÂY ---
  async findOne(id: string): Promise<Course> {
    // <-- Đổi id: number thành id: string
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với ID #${id}`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // <-- Đổi id: number thành id: string
    const course = await this.courseRepository.preload({
      id: id,
      ...updateCourseDto,
    });
    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với ID #${id}`);
    }
    return this.courseRepository.save(course);
  }

  async remove(id: string): Promise<Course> {
    // <-- Đổi id: number thành id: string
    const course = await this.findOne(id);
    return this.courseRepository.remove(course);
  }
}
