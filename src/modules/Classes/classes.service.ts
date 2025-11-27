// src/modules/classes/classes.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // 👈 Nhớ import In
import { Class } from './database/class.entity';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { Course } from '../courses/database/courses.entity';
import { User } from '../auth/database/user.entity';
import { Enrollment } from './database/enrollment.entity';
import { UserRole } from 'src/constant/enum';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private classRepo: Repository<Class>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
  ) {}

  // 1. CREATE
  async create(dto: CreateClassDto): Promise<Class> {
    // Tìm danh sách khóa học
    const courses = await this.courseRepo.findBy({ 
      id: In(dto.courseIds) 
    });
    if (courses.length !== dto.courseIds.length) {
      throw new NotFoundException('Một số khóa học không tồn tại');
    }

    // Tìm danh sách giảng viên
    const teachers = await this.userRepo.findBy({ 
      user_id: In(dto.teacherIds) 
    });
    if (teachers.length !== dto.teacherIds.length) {
      throw new NotFoundException('Một số giảng viên không tồn tại');
    }
    
    // Check trùng mã lớp
    const existing = await this.classRepo.findOneBy({ code: dto.code });
    if (existing) throw new BadRequestException(`Class Code '${dto.code}' already exists`);

    // Lưu
    const newClass = this.classRepo.create({ 
      ...dto, 
      courses, // TypeORM tự lưu vào bảng trung gian
      teachers 
    });
    return this.classRepo.save(newClass);
  }

  // 2. FIND ALL
  async findAll(currentUser: any): Promise<any[]> {
    const query = this.classRepo.createQueryBuilder('class')
      // Join bảng quan hệ nhiều-nhiều
      .leftJoinAndSelect('class.courses', 'courses')
      .leftJoinAndSelect('class.teachers', 'teachers')
      .loadRelationCountAndMap('class.total_students', 'class.enrollments')
      .orderBy('class.created_at', 'DESC');

    // Nếu là TEACHER -> Chỉ lấy lớp mình có tên trong danh sách giáo viên
    if (currentUser.role === UserRole.TEACHER) {
      // Logic: Tìm lớp mà trong danh sách teachers có ID của user hiện tại
      query.where('teachers.user_id = :teacherId', { teacherId: currentUser.user_id });
    }

    return query.getMany();
  }

  // 3. FIND ONE
  async findOne(id: string): Promise<Class> {
    const classInfo = await this.classRepo.findOne({
      where: { class_id: id },
      relations: ['courses', 'teachers'], // Load mảng courses và teachers
    });
    if (!classInfo) throw new NotFoundException('Class not found');
    return classInfo;
  }

  // 4. UPDATE
  async update(id: string, dto: UpdateClassDto): Promise<Class> {
    const existingClass = await this.classRepo.findOne({
        where: { class_id: id },
        relations: ['courses', 'teachers'] // Cần load quan hệ lên để update
    });

    if (!existingClass) throw new NotFoundException('Class not found');

    // Cập nhật Courses (nếu có gửi lên)
    if (dto.courseIds) {
      const courses = await this.courseRepo.findBy({ id: In(dto.courseIds) });
      if (courses.length !== dto.courseIds.length) throw new NotFoundException('Khóa học không tồn tại');
      existingClass.courses = courses;
    }

    // Cập nhật Teachers (nếu có gửi lên)
    if (dto.teacherIds) {
      const teachers = await this.userRepo.findBy({ user_id: In(dto.teacherIds) });
      if (teachers.length !== dto.teacherIds.length) throw new NotFoundException('Giảng viên không tồn tại');
      existingClass.teachers = teachers;
    }

    // Merge các field đơn giản (name, status...)
    const { courseIds, teacherIds, ...simpleFields } = dto;
    Object.assign(existingClass, simpleFields);

    return this.classRepo.save(existingClass);
  }

  // ... Các hàm remove, enrollment giữ nguyên ...
  async remove(id: string): Promise<void> {
    const result = await this.classRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Class not found');
  }

  async addStudentToClass(classId: string, studentId: string) {
    // Code cũ giữ nguyên
    const classInfo = await this.classRepo.findOneBy({ class_id: classId });
    if (!classInfo) throw new NotFoundException('Class not found');

    const student = await this.userRepo.findOneBy({ user_id: studentId });
    if (!student) throw new NotFoundException('Student not found');

    const exists = await this.enrollmentRepo.findOne({
      where: { class: { class_id: classId }, student: { user_id: studentId } }
    });
    if (exists) throw new ConflictException('Student is already in this class');

    const enrollment = this.enrollmentRepo.create({
      class: classInfo,
      student: student,
    });
    return this.enrollmentRepo.save(enrollment);
  }

  async getStudentsByClass(classId: string) {
    // Code cũ giữ nguyên
    const enrollments = await this.enrollmentRepo.find({
      where: { class: { class_id: classId } },
      relations: ['student'],
      order: { joined_at: 'DESC' }
    });

    return enrollments.map(e => ({
      enrollment_id: e.id,
      student_id: e.student.user_id,
      full_name: e.student.full_name,
      email: e.student.email,
      avatar: e.student.avatar,
      joined_at: e.joined_at,
      phone: e.student.phone,
      address: e.student.address,
      gender: e.student.gender,
      student_code: e.student.student_code,
      dateOfBirth: e.student.dateOfBirth,
    }));
  }

  async removeStudentFromClass(classId: string, studentId: string): Promise<void> {
    // Code cũ giữ nguyên
    const enrollment = await this.enrollmentRepo.findOne({
      where: { 
        class: { class_id: classId }, 
        student: { user_id: studentId } 
      }
    });
    if (!enrollment) throw new NotFoundException('Học viên không có trong lớp này');
    await this.enrollmentRepo.remove(enrollment);
  }
}