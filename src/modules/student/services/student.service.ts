// src/modules/users/services/student.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { StudentRepository } from '../repositories/student.repository';
import { CreateStudentDto } from '../dtos/request/create-student.dto';
import { UpdateStudentDto } from '../dtos/request/update-student.dto';
import { UpdateProfileDto } from '../dtos/request/update-profile.dto';
import { ChangePasswordDto } from '../dtos/request/change-password.dto';
import { SearchStudentDto } from '../dtos/request/search-student.dto';
import { StudentResponseDto } from '../dtos/response/student-response.dto';
import { PaginatedStudentsResponseDto } from '../dtos/response/paginated-students-response.dto';
import { CreateStudentBulkDto } from '../dtos/request/create-student-bulk.dto';
import { StudentCoursesResponseDto } from '../dtos/response/student-courses-response.dto';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  private async generateStudentCode(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `SV${currentYear}`;

    const lastCode = await this.studentRepository.findLastStudentCode();
    let sequence = 1;
    if (lastCode && lastCode.startsWith(prefix)) {
      const lastSeq = parseInt(lastCode.replace(prefix, ''), 10);
      if (!isNaN(lastSeq)) sequence = lastSeq + 1;
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }

  async create(createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    if (await this.studentRepository.findByEmail(createStudentDto.email)) {
      throw new ConflictException('Email đã tồn tại');
    }

    let studentCode = createStudentDto.studentCode;
    if (studentCode) {
      if (await this.studentRepository.findByStudentCode(studentCode)) {
        throw new ConflictException('Mã sinh viên đã tồn tại');
      }
    } else {
      studentCode = await this.generateStudentCode();
    }

    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    const student = await this.studentRepository.create({
      ...createStudentDto,
      student_code: studentCode,
      password: hashedPassword,
    });

    return new StudentResponseDto(student);
  }

  async createBulk(bulkDto: CreateStudentBulkDto) {
    let success = 0;
    const errors = [];

    for (const studentDto of bulkDto.students) {
      try {
        await this.create(studentDto);
        success++;
      } catch (err) {
        errors.push({ email: studentDto.email, error: err.message });
      }
    }

    return { success, failed: errors.length, errors };
  }

  async findAll(searchDto: SearchStudentDto): Promise<PaginatedStudentsResponseDto> {
    const { students, total } = await this.studentRepository.findAll(searchDto);
    const dtos = students.map(s => new StudentResponseDto(s));
    return new PaginatedStudentsResponseDto(dtos, total, searchDto.page || 1, searchDto.limit || 10);
  }

  async findOne(id: string): Promise<StudentResponseDto> {
    const student = await this.studentRepository.findOne(id);
    if (!student) throw new NotFoundException('Học viên không tồn tại');
    return new StudentResponseDto(student);
  }

  async update(id: string, dto: UpdateStudentDto): Promise<StudentResponseDto> {
    if (dto.email) {
      const existing = await this.studentRepository.findByEmail(dto.email);
      if (existing && existing.user_id !== id) throw new ConflictException('Email đã tồn tại');
    }
    const student = await this.studentRepository.update(id, dto);
    if (!student) throw new NotFoundException('Học viên không tồn tại');
    return new StudentResponseDto(student);
  }

  async delete(id: string): Promise<void> {
    const student = await this.studentRepository.delete(id);
    if (!student) throw new NotFoundException('Học viên không tồn tại');
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<StudentResponseDto> {
    const student = await this.studentRepository.update(userId, dto);
    if (!student) throw new NotFoundException('Người dùng không tồn tại');
    return new StudentResponseDto(student);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const student = await this.studentRepository.findOne(userId);
    if (!student) throw new NotFoundException('Người dùng không tồn tại');

    const isValid = await bcrypt.compare(dto.currentPassword, student.password);
    if (!isValid) throw new BadRequestException('Mật khẩu hiện tại không đúng');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.studentRepository.update(userId, { password: hashed } as UpdateStudentDto);
    return { message: 'Đổi mật khẩu thành công' };
  }

  // ✅ Lấy danh sách khóa học của học viên
  async getCoursesOfStudent(studentId: string): Promise<StudentCoursesResponseDto> {
    const student = await this.studentRepository.findOneWithCourses(studentId);
    if (!student) throw new NotFoundException('Học viên không tồn tại');

    const courses = student.enrollments.flatMap(e => e.class?.courses || []);
    const unique = Array.from(new Map(courses.map(c => [c.id, c])).values());

    return new StudentCoursesResponseDto(unique);
  }
}
