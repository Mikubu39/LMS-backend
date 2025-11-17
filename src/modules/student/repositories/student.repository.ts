import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/auth/database/user.entity';
import { CreateStudentDto } from '../dtos/request/create-student.dto';
import { UpdateStudentDto } from '../dtos/request/update-student.dto';
import { SearchStudentDto } from '../dtos/request/search-student.dto';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(User)
    private studentRepository: Repository<User>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<User> {
    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  async findAll(
    searchDto: SearchStudentDto,
  ): Promise<{ students: User[]; total: number }> {
    // <<< SỬA ĐỔI: Thêm 'role' vào destructuring
    const { search, email, full_name, role, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.studentRepository.createQueryBuilder('student');

    if (search) {
      queryBuilder.where(
        '(student.email LIKE :search OR student.full_name LIKE :search OR student.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (email) {
      queryBuilder.andWhere('student.email LIKE :email', {
        email: `%${email}%`,
      });
    }

    if (full_name) {
      queryBuilder.andWhere('student.full_name LIKE :full_name', {
        full_name: `%${full_name}%`,
      });
    }

    // --- THÊM MỚI TẠI ĐÂY ---
    if (role) {
      // Thêm điều kiện lọc theo vai trò
      queryBuilder.andWhere('student.role = :role', { role });
    }
    // --- KẾT THÚC THÊM MỚI ---

    const [students, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { students, total };
  }

  async findOne(user_id: string): Promise<User | null> {
    return this.studentRepository.findOne({ where: { user_id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.studentRepository.findOne({ where: { email } });
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<User | null> {
    await this.studentRepository.update(id, updateStudentDto);
    return this.findOne(id);
  }

  async delete(id: string): Promise<User | null> {
    const student = await this.findOne(id);
    if (student) {
      await this.studentRepository.delete(id);
    }
    return student;
  }
}