import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../database/submission.entity';
import { CreateSubmissionDto } from '../dtos/request/create-submission.dto';
import { SearchSubmissionDto } from '../dtos/request/search-submission.dto';

@Injectable()
export class SubmissionRepository {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  // Hàm create này có thể ít dùng vì service đã xử lý, nhưng cập nhật cho đồng bộ
  async create(
    createSubmissionDto: CreateSubmissionDto,
    studentId: string,
  ): Promise<Submission> {
    const submission = this.submissionRepository.create({
      ...createSubmissionDto, // Đã bao gồm classId từ DTO
      studentId,
    });
    return this.submissionRepository.save(submission);
  }

  async findAll(
    searchDto: SearchSubmissionDto,
  ): Promise<{ submissions: Submission[]; total: number }> {
    const {
      search,
      studentId,
      gitLink,
      status,
      classId, // 👈 Lấy tham số classId
      page = 1,
      limit = 10,
    } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.student', 'student')
      .leftJoinAndSelect('submission.class', 'class') // Join thêm Class để hiển thị
      .leftJoinAndSelect('submission.lessonItem', 'lessonItem');

    if (search) {
      queryBuilder.where(
        '(submission.gitLink LIKE :search OR submission.description LIKE :search OR student.full_name LIKE :search OR student.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (studentId) {
      queryBuilder.andWhere('submission.studentId = :studentId', { studentId });
    }

    // 👇 Filter theo Class
    if (classId) {
      queryBuilder.andWhere('submission.classId = :classId', { classId });
    }

    if (gitLink) {
      queryBuilder.andWhere('submission.gitLink LIKE :gitLink', {
        gitLink: `%${gitLink}%`,
      });
    }

    if (status) {
      queryBuilder.andWhere('submission.status = :status', { status });
    }

    const [submissions, total] = await queryBuilder
      .orderBy('submission.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { submissions, total };
  }

  async findByStudentId(studentId: string): Promise<Submission[]> {
    return this.submissionRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
      relations: ['student', 'class', 'lessonItem'], // Load thêm class
    });
  }
}