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
import { CreateStudentBulkDto } from '../dtos/request/create-student-bulk.dto'

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  private async generateStudentCode(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `SV${currentYear}`; // Ví dụ: SV2025

    // 1. Lấy mã của sinh viên cuối cùng
    const lastCode = await this.studentRepository.findLastStudentCode();

    let sequence = 1;

    // 2. Nếu đã có sinh viên và mã bắt đầu bằng prefix năm nay (SV2025...)
    if (lastCode && lastCode.startsWith(prefix)) {
      // Cắt bỏ prefix để lấy số đuôi (Ví dụ: SV20250001 -> 0001)
      const lastSequenceStr = lastCode.replace(prefix, '');
      const lastSequence = parseInt(lastSequenceStr, 10);
      
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }

    // 3. Format số thành 4 chữ số (1 -> 0001, 15 -> 0015)
    const sequenceStr = sequence.toString().padStart(4, '0');
    
    return `${prefix}${sequenceStr}`;
  }

  async create(createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    const existingStudent = await this.studentRepository.findByEmail(
      createStudentDto.email,
    );

    if (existingStudent) {
      throw new ConflictException('Email đã tồn tại');
    }

    // LOGIC MỚI:
    // Nếu admin NHẬP mã -> Dùng mã admin nhập (vẫn check trùng)
    // Nếu admin KHÔNG NHẬP -> Tự động sinh
    let finalStudentCode = createStudentDto.studentCode;

    if (finalStudentCode) {
      const existingCode = await this.studentRepository.findByStudentCode(finalStudentCode);
      if (existingCode) throw new ConflictException('Mã sinh viên đã tồn tại');
    } else {
      // Tự động sinh mã
      finalStudentCode = await this.generateStudentCode();
    }
    
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
    
    const student = await this.studentRepository.create({
      ...createStudentDto,
      student_code: finalStudentCode, // Gán mã đã xử lý vào đây
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

async createBulk(bulkDto: CreateStudentBulkDto): Promise<{ success: number; failed: number; errors: any[] }> {
    let successCount = 0;
    const errors = [];

    for (const studentDto of bulkDto.students) {
      try {
        // Tận dụng hàm create lẻ đã có logic sinh mã tự động
        await this.create(studentDto);
        successCount++;
      } catch (error) {
        errors.push({
          email: studentDto.email,
          error: error.message
        });
      }
    }

    return {
      success: successCount,
      failed: errors.length,
      errors
    };
  }
}

