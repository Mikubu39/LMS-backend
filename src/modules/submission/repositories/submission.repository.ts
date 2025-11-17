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

  async create(
    createSubmissionDto: CreateSubmissionDto,
    studentId: string,
  ): Promise<Submission> {
    const submission = this.submissionRepository.create({
      ...createSubmissionDto,
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
      page = 1,
      limit = 10,
    } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.student', 'student');

    if (search) {
      queryBuilder.where(
        '(submission.gitLink LIKE :search OR submission.description LIKE :search OR student.full_name LIKE :search OR student.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (studentId) {
      queryBuilder.andWhere('submission.studentId = :studentId', { studentId });
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

  async findOne(id: string): Promise<Submission | null> {
    return this.submissionRepository.findOne({
      where: { id },
      relations: ['student'],
    });
  }

  async findByStudentId(studentId: string): Promise<Submission[]> {
    return this.submissionRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
      relations: ['student'],
    });
  }

  async update(
    id: string,
    updateData: Partial<Submission>,
  ): Promise<Submission | null> {
    await this.submissionRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.submissionRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}

