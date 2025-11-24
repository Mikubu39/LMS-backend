import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './database/class.entity';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { Course } from '../courses/database/courses.entity';
import { User } from '../auth/database/user.entity';
import { Enrollment } from './database/enrollment.entity';
import { UserRole } from 'src/constant/enum'; // Nhớ import Enum Role

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private classRepo: Repository<Class>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
  ) {}

  async create(dto: CreateClassDto): Promise<Class> {
    const course = await this.courseRepo.findOneBy({ id: dto.course_id });
    if (!course) throw new NotFoundException('Course not found');
    const teacher = await this.userRepo.findOneBy({ user_id: dto.teacher_id });
    if (!teacher) throw new NotFoundException('Teacher not found');
    
    const existing = await this.classRepo.findOneBy({ code: dto.code });
    if (existing) throw new BadRequestException(`Class Code '${dto.code}' already exists`);

    const newClass = this.classRepo.create({ ...dto, course, teacher });
    return this.classRepo.save(newClass);
  }

  // 👇 UPDATE LOGIC Ở ĐÂY
  async findAll(currentUser: any): Promise<any[]> {
    const query = this.classRepo.createQueryBuilder('class')
      .leftJoinAndSelect('class.course', 'course')
      .leftJoinAndSelect('class.teacher', 'teacher')
      // 👇 Đếm số lượng enrollment và map vào field ảo 'total_students'
      .loadRelationCountAndMap('class.total_students', 'class.enrollments')
      .orderBy('class.created_at', 'DESC');

    // Nếu là TEACHER -> Chỉ lấy lớp mình dạy
    if (currentUser.role === UserRole.TEACHER) {
      query.where('teacher.user_id = :teacherId', { teacherId: currentUser.user_id });
    }

    // Nếu là ADMIN -> Lấy hết (Không cần where)
    
    return query.getMany();
  }

  async findOne(id: string): Promise<Class> {
    const classInfo = await this.classRepo.findOne({
      where: { class_id: id },
      relations: ['course', 'teacher'],
    });
    if (!classInfo) throw new NotFoundException('Class not found');
    return classInfo;
  }

  async update(id: string, dto: UpdateClassDto): Promise<Class> {
    const existingClass = await this.findOne(id);
    if (dto.course_id) {
      const course = await this.courseRepo.findOneBy({ id: dto.course_id });
      if (!course) throw new NotFoundException('Course not found');
      existingClass.course = course;
    }
    if (dto.teacher_id) {
      const teacher = await this.userRepo.findOneBy({ user_id: dto.teacher_id });
      if (!teacher) throw new NotFoundException('Teacher not found');
      existingClass.teacher = teacher;
    }
    Object.assign(existingClass, dto);
    return this.classRepo.save(existingClass);
  }

  async remove(id: string): Promise<void> {
    const result = await this.classRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Class not found');
  }

  // --- Logic Enrollments ---

  async addStudentToClass(classId: string, studentId: string) {
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
      progress: 0
    });
    return this.enrollmentRepo.save(enrollment);
  }

  async getStudentsByClass(classId: string) {
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
      progress: e.progress,
      joined_at: e.joined_at
    }));
  }
  async removeStudentFromClass(classId: string, studentId: string): Promise<void> {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { 
        class: { class_id: classId }, 
        student: { user_id: studentId } 
      }
    });

    if (!enrollment) {
      throw new NotFoundException('Học viên không có trong lớp này');
    }

    await this.enrollmentRepo.remove(enrollment);
  }
}