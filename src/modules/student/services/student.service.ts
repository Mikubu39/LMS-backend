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


@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async create(createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    const existingStudent = await this.studentRepository.findByEmail(
      createStudentDto.email,
    );

    if (existingStudent) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
    const student = await this.studentRepository.create({
      ...createStudentDto,
      password: hashedPassword,
    });

    return new StudentResponseDto(student);
  }

  async findAll(
    searchDto: SearchStudentDto,
  ): Promise<PaginatedStudentsResponseDto> {
    const { students, total } = await this.studentRepository.findAll(searchDto);

    const studentDtos = students.map(
      (student) => new StudentResponseDto(student),
    );

    return new PaginatedStudentsResponseDto(
      studentDtos,
      total,
      searchDto.page || 1,
      searchDto.limit || 10,
    );
  }

  async findOne(id: string): Promise<StudentResponseDto> {
    const student = await this.studentRepository.findOne(id);

    if (!student) {
      throw new NotFoundException('Học viên không tồn tại');
    }

    return new StudentResponseDto(student);
  }

  async update(
    user_id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    if (updateStudentDto.email) {
      const existingStudent = await this.studentRepository.findByEmail(
        updateStudentDto.email,
      );

      if (existingStudent && existingStudent.user_id !== user_id) {
        throw new ConflictException('Email đã tồn tại');
      }
    }

    const student = await this.studentRepository.update(user_id, updateStudentDto);

    if (!student) {
      throw new NotFoundException('Học viên không tồn tại');
    }

    return new StudentResponseDto(student);
  }

  async delete(id: string): Promise<void> {
    const student = await this.studentRepository.delete(id);

    if (!student) {
      throw new NotFoundException('Học viên không tồn tại');
    }
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<StudentResponseDto> {
    const student = await this.studentRepository.update(userId, updateProfileDto);

    if (!student) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return new StudentResponseDto(student);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const student = await this.studentRepository.findOne(userId);

    if (!student) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      student.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );

    await this.studentRepository.update(userId, {
      password: hashedNewPassword,
    } as UpdateStudentDto);

    return { message: 'Đổi mật khẩu thành công' };
  }
}

