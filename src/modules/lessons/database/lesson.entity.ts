// src/modules/lessons/database/lesson.entity.ts

import { Session } from '../../sessions/database/session.entity';
import { Quiz } from '../../quizzes/database/quiz.entity'; // KẾT HỢP: Import Quiz entity
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// GIỮ LẠI: Enum loại bài học rất hữu ích
export enum LessonType {
  VIDEO = 'Video',
  TEXT = 'Text',
  QUIZ = 'Quiz',
}

@Entity('lessons')
export class Lesson {
  // GIỮ LẠI: Dùng UUID làm khóa chính rất tốt cho việc mở rộng sau này
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  // GIỮ LẠI: Các thuộc tính chi tiết từ nhánh origin/Y
  @Column({ type: 'int', default: 0 })
  duration: number; // Thời lượng bài học tính bằng giây

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'enum', enum: LessonType, default: LessonType.VIDEO })
  type: LessonType;

  // GIỮ LẠI: Mối quan hệ với Session có vẻ hợp lý hơn
  @ManyToOne(() => Session, (session) => session.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  // KẾT HỢP: Thêm lại mối quan hệ với Quiz từ nhánh của bạn
  @OneToMany(() => Quiz, (quiz) => quiz.lesson)
  quizzes: Quiz[];

  // GIỮ LẠI: Các cột thời gian là một practice tốt
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}