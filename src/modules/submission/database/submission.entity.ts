import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/auth/database/user.entity';
import { LessonItem } from 'src/modules/lessons/database/lesson-item.entity';
export enum SubmissionStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  // 👇 THÊM CỘT NÀY (Quan trọng nhất)
  @Column({ type: 'uuid' })
  lessonItemId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'studentId' })
  student: User;

  // 👇 Link sang LessonItem để query ngược nếu cần
  @ManyToOne(() => LessonItem, { onDelete: 'CASCADE' }) // 👈 Thêm onDelete: CASCADE
  @JoinColumn({ name: 'lessonItemId' })
  lessonItem: LessonItem;

  @Column({ type: 'text' })
  gitLink: string; // Hoặc đổi tên thành 'content' nếu muốn nộp cả text

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  score: number; 

  @Column({ type: 'uuid', nullable: true })
  reviewerId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

