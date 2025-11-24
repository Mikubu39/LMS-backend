import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmissionRepository } from '../repositories/submission.repository';
import { CreateSubmissionDto } from '../dtos/request/create-submission.dto';
import { SearchSubmissionDto } from '../dtos/request/search-submission.dto';
import { SubmissionResponseDto } from '../dtos/response/submission-response.dto';
import { PaginatedSubmissionsResponseDto } from '../dtos/response/paginated-submissions-response.dto';

// 👇 Import Entity LessonItem để kiểm tra logic
import { LessonItem, LessonItemType } from '../../lessons/database/lesson-item.entity';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    
    // 👇 Inject thêm Repository này để check bài tập
    @InjectRepository(LessonItem)
    private readonly lessonItemRepository: Repository<LessonItem>,
  ) {}

  async create(
    createSubmissionDto: CreateSubmissionDto,
    studentId: string,
  ): Promise<SubmissionResponseDto> {
    // 1. Lấy ID bài tập từ DTO (Bạn nhớ đã update DTO thêm trường lessonItemId nhé)
    const { lessonItemId } = createSubmissionDto;

    // 2. Kiểm tra xem bài tập này có tồn tại trong DB không
    const lessonItem = await this.lessonItemRepository.findOne({
      where: { id: lessonItemId },
    });

    if (!lessonItem) {
      throw new NotFoundException('Bài tập này không tồn tại hoặc đã bị xóa.');
    }

    // 3. Kiểm tra xem đây có đúng là bài Tự luận (Essay) để nộp không
    // (Tránh trường hợp student gửi request nộp bài vào 1 cái Video)
    if (lessonItem.type !== LessonItemType.ESSAY) {
      throw new BadRequestException('Đây không phải là bài tập tự luận, bạn không thể nộp bài tại đây.');
    }

    // 4. Gọi Repository để tạo submission
    // (Repository sẽ tự map lessonItemId vào database nhờ spread operator ...createSubmissionDto)
    const submission = await this.submissionRepository.create(
      createSubmissionDto,
      studentId,
    );

    // 5. Load lại data kèm thông tin student để trả về response đầy đủ
    const submissionWithStudent = await this.submissionRepository.findOne(
      submission.id,
    );

    if (!submissionWithStudent) {
      throw new NotFoundException('Không tìm thấy bài nộp vừa tạo.');
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