// File: src/modules/submission/services/submission.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmissionRepository } from '../repositories/submission.repository';
import { Submission, SubmissionStatus } from '../database/submission.entity';
import { LessonItem, LessonItemType } from '../../lessons/database/lesson-item.entity';
import { CreateSubmissionDto } from '../dtos/request/create-submission.dto';
import { SearchSubmissionDto } from '../dtos/request/search-submission.dto';
import { SubmissionResponseDto } from '../dtos/response/submission-response.dto';
import { PaginatedSubmissionsResponseDto } from '../dtos/response/paginated-submissions-response.dto';
// 👇 Import DTO chấm điểm
import { GradeSubmissionDto } from '../dtos/request/grade-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    // 1. Custom Repository: Dùng cho các query phức tạp (findAll, findByStudentId)
    private readonly submissionCustomRepo: SubmissionRepository,

    // 2. Standard Repository: Dùng cho CRUD chuẩn (create, save, findOne, grade)
    @InjectRepository(Submission)
    private readonly submissionTypeOrmRepo: Repository<Submission>,

    @InjectRepository(LessonItem)
    private readonly lessonItemRepository: Repository<LessonItem>,
  ) {}

  // --- 1. TẠO BÀI NỘP ---
  async create(
    createSubmissionDto: CreateSubmissionDto,
    studentId: string,
  ): Promise<SubmissionResponseDto> {
    const { lessonItemId, gitLink, description } = createSubmissionDto;

    // Check bài tập
    const lessonItem = await this.lessonItemRepository.findOne({
      where: { id: lessonItemId },
    });
    if (!lessonItem) throw new NotFoundException('Bài tập không tồn tại.');
    if (lessonItem.type !== LessonItemType.ESSAY) {
      throw new BadRequestException('Chỉ được nộp bài cho bài tập tự luận (Essay).');
    }

    // Check bài cũ
    let submission = await this.submissionTypeOrmRepo.findOne({
      where: { studentId, lessonItemId },
    });

    if (submission) {
      if (submission.status === SubmissionStatus.APPROVED) {
        throw new BadRequestException('Bài tập này đã ĐẬU, không cần nộp lại.');
      }
      // Resubmit
      submission.gitLink = gitLink;
      submission.description = description;
      submission.status = SubmissionStatus.PENDING;
      await this.submissionTypeOrmRepo.save(submission);
    } else {
      // Create new
      submission = this.submissionTypeOrmRepo.create({
        studentId,
        lessonItemId,
        gitLink,
        description,
        status: SubmissionStatus.PENDING,
      });
      await this.submissionTypeOrmRepo.save(submission);
    }

    // Load full data
    const finalSubmission = await this.submissionTypeOrmRepo.findOne({
      where: { id: submission.id },
      relations: ['student', 'lessonItem'],
    });

    return new SubmissionResponseDto(finalSubmission);
  }

  // --- 2. CHẤM ĐIỂM (MỚI) ---
  async grade(
    id: string,
    dto: GradeSubmissionDto,
    reviewerId: string,
  ): Promise<SubmissionResponseDto> {
    const submission = await this.submissionTypeOrmRepo.findOne({
      where: { id },
      relations: ['student', 'lessonItem'],
    });

    if (!submission) {
      throw new NotFoundException('Không tìm thấy bài nộp');
    }

    // Cập nhật thông tin (Dùng ?? để tránh lỗi nếu gửi thiếu trường)
    if (dto.status) submission.status = dto.status;
    
    // Lưu ý: score có thể là 0 nên dùng ?? thay vì ||
    if (dto.score !== undefined && dto.score !== null) {
        submission.score = dto.score;
    }

    if (dto.feedback !== undefined) {
        submission.feedback = dto.feedback;
    }
    
    submission.reviewerId = reviewerId;

    const savedSubmission = await this.submissionTypeOrmRepo.save(submission);

    return new SubmissionResponseDto(savedSubmission);
  }

  async findAll(
    searchDto: SearchSubmissionDto,
  ): Promise<PaginatedSubmissionsResponseDto> {
    // Sửa lỗi gọi sai tên biến: this.submissionRepository -> this.submissionCustomRepo
    const { submissions, total } = await this.submissionCustomRepo.findAll(searchDto);

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
    // Ưu tiên dùng TypeOrmRepo để load relations đầy đủ nếu cần
    const submission = await this.submissionTypeOrmRepo.findOne({
        where: { id },
        relations: ['student', 'lessonItem'] 
    });

    if (!submission) {
      throw new NotFoundException('Bài nộp không tồn tại');
    }

    return new SubmissionResponseDto(submission);
  }

  async findByStudentId(studentId: string): Promise<SubmissionResponseDto[]> {
    // Sửa lỗi gọi sai tên biến
    const submissions = await this.submissionCustomRepo.findByStudentId(studentId);

    return submissions.map(
      (submission) => new SubmissionResponseDto(submission),
    );
  }
}