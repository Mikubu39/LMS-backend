import { SubmissionStatus } from '../../database/submission.entity';
import { StudentResponseDto } from 'src/modules/student/dtos/response/student-response.dto';

export class SubmissionResponseDto {
  id: string;
  studentId: string;
  student?: StudentResponseDto;
  gitLink: string;
  description?: string;
  status: SubmissionStatus;
  feedback?: string;
  reviewerId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(submission: any) {
    this.id = submission.id;
    this.studentId = submission.studentId;
    if (submission.student) {
      this.student = new StudentResponseDto(submission.student);
    }
    this.gitLink = submission.gitLink;
    this.description = submission.description;
    this.status = submission.status;
    this.feedback = submission.feedback;
    this.reviewerId = submission.reviewerId;
    this.createdAt = submission.createdAt;
    this.updatedAt = submission.updatedAt;
  }
}

