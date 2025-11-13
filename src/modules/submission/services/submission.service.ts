import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SubmissionRepository } from '../repositories/submission.repository';
import { CreateSubmissionDto } from '../dtos/request/create-submission.dto';
import { SearchSubmissionDto } from '../dtos/request/search-submission.dto';
import { SubmissionResponseDto } from '../dtos/response/submission-response.dto';
import { PaginatedSubmissionsResponseDto } from '../dtos/response/paginated-submissions-response.dto';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly submissionRepository: SubmissionRepository,
  ) {}

  async create(
    createSubmissionDto: CreateSubmissionDto,
    studentId: string,
  ): Promise<SubmissionResponseDto> {
    const submission = await this.submissionRepository.create(
      createSubmissionDto,
      studentId,
    );

    // Load relation để có student data
    const submissionWithStudent = await this.submissionRepository.findOne(
      submission.id,
    );

    if (!submissionWithStudent) {
      throw new NotFoundException('Không tìm thấy bài nộp');
    }

    return new SubmissionResponseDto(submissionWithStudent);
  }

  async findAll(
    searchDto: SearchSubmissionDto,
  ): Promise<PaginatedSubmissionsResponseDto> {
    const { submissions, total } =
      await this.submissionRepository.findAll(searchDto);

    const submissionDtos = submissions.map(
      (submission) => new SubmissionResponseDto(submission),
    );

    return new PaginatedSubmissionsResponseDto(
      submissionDtos,
      total,
      searchDto.page || 1,
      searchDto.limit || 10,
    );
  }

  async findOne(id: string): Promise<SubmissionResponseDto> {
    const submission = await this.submissionRepository.findOne(id);

    if (!submission) {
      throw new NotFoundException('Bài nộp không tồn tại');
    }

    return new SubmissionResponseDto(submission);
  }

  async findByStudentId(studentId: string): Promise<SubmissionResponseDto[]> {
    const submissions =
      await this.submissionRepository.findByStudentId(studentId);

    return submissions.map(
      (submission) => new SubmissionResponseDto(submission),
    );
  }
}

