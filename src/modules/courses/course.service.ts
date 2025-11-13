// src/modules/courses/course.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { Course } from './database/courses.entity';
import { User } from '../auth/database/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. LOGIC TẠO KHÓA HỌC
  async create(createCourseDto: CreateCourseDto, currentUser: User): Promise<Course> {
    let instructor = currentUser; // Mặc định lấy người đang đăng nhập

    // Nếu request có gửi ID giảng viên (Trường hợp Admin tạo hộ)
    if (createCourseDto.instructorId) {
      const foundInstructor = await this.userRepository.findOneBy({ 
        user_id: createCourseDto.instructorId 
      });
      if (!foundInstructor) {
        throw new NotFoundException('Không tìm thấy giảng viên với ID đã cung cấp');
      }
      instructor = foundInstructor;
    }

    // Loại bỏ instructorId khỏi DTO để tránh lỗi khi tạo Course
    const { instructorId, ...courseData } = createCourseDto;

    const course = this.courseRepository.create({
      ...courseData,
      instructor: instructor, // Gán object user vào
    });

    return this.courseRepository.save(course);
  }

  // 2. LOGIC LẤY DANH SÁCH (KÈM INFO GIẢNG VIÊN)
  findAll(paginationOptions: { page: number; limit: number }): Promise<Course[]> {
    const { page, limit } = paginationOptions;
    return this.courseRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['instructor'], // Join bảng User
      select: {
        // Chỉ lấy thông tin cần thiết (Bảo mật)
        instructor: {
          user_id: true,
          full_name: true,
          avatar: true,
          email: true,
        },
      },
    });
  }

  // 3. LOGIC LẤY CHI TIẾT (KÈM INFO GIẢNG VIÊN)
  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['instructor'],
      select: {
        instructor: {
          user_id: true,
          full_name: true,
          avatar: true,
          email: true,
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với ID #${id}`);
    }
    return course;
  }

  // 4. LOGIC UPDATE (CHO PHÉP ĐỔI GIẢNG VIÊN)
  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    // Nếu muốn đổi giảng viên
    if (updateCourseDto.instructorId) {
       const newInstructor = await this.userRepository.findOneBy({ 
         user_id: updateCourseDto.instructorId 
       });
       if (!newInstructor) {
         throw new NotFoundException('Giảng viên mới không tồn tại');
       }
       course.instructor = newInstructor;
    }

    const { instructorId, ...courseData } = updateCourseDto;

    // Preload dữ liệu mới vào entity cũ
    const updatedCourse = await this.courseRepository.preload({
      id: id,
      ...courseData,
      instructor: course.instructor
    });

    return this.courseRepository.save(updatedCourse);
  }

  async remove(id: string): Promise<Course> {
    const course = await this.findOne(id);
    return this.courseRepository.remove(course);
  }
}