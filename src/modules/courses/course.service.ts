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
    // Đã xóa UserRepository vì không còn dùng đến User nữa
  ) {}

  // 1. LOGIC TẠO KHÓA HỌC
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    // Logic đơn giản hơn nhiều: chỉ tạo và lưu
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  // 2. LOGIC LẤY DANH SÁCH
  findAll(paginationOptions: { page: number; limit: number }): Promise<Course[]> {
    const { page, limit } = paginationOptions;
    return this.courseRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      // Đã xóa relations: ['instructor']
      // Đã xóa select instructor
    });
  }

  // 3. LOGIC LẤY CHI TIẾT
  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: [
        // Đã xóa 'instructor'
        'sessions',
        'sessions.lessons',
      ],
      order: {
        sessions: {
          order: 'ASC',
          createdAt: 'ASC',
          lessons: {
            order: 'ASC',
            createdAt: 'ASC',
          },
        },
      },
      // Đã xóa select instructor
    });

    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với ID #${id}`);
    }
    return course;
  }

  // 4. LOGIC UPDATE
  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Không cần check instructorId, preload thẳng dữ liệu vào
    const updatedCourse = await this.courseRepository.preload({
      id: id,
      ...updateCourseDto,
    });

    if (!updatedCourse) {
      throw new NotFoundException(`Không tìm thấy khóa học với ID #${id}`);
    }

    return this.courseRepository.save(updatedCourse);
  }

  async remove(id: string): Promise<Course> {
    const course = await this.findOne(id);
    return this.courseRepository.remove(course);
  }

  async findFullCurriculum(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: [
        'sessions',
        'sessions.lessons',
        'sessions.lessons.items',
      ],
      order: {
        sessions: {
          order: 'ASC',
          createdAt: 'ASC',
          lessons: {
            order: 'ASC',
            createdAt: 'ASC',
            items: {
              orderIndex: 'ASC',
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học #${id}`);
    }

    return course.sessions;
  }
}