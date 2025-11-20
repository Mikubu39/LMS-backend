// src/modules/lessons/database/lesson.entity.ts

import { Session } from '../../sessions/database/session.entity';
import { Quiz } from '../../quizzes/database/quiz.entity';
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

// 👇 CẬP NHẬT: Chỉ giữ 4 loại này (Viết Hoa chữ cái đầu)
export enum LessonType {
  VIDEO = 'Video',
  TEXT = 'Text',
  QUIZ = 'Quiz',
  ESSAY = 'Essay', // Loại mới cho Tự luận
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  // Mặc định là VIDEO
  @Column({ type: 'enum', enum: LessonType, default: LessonType.VIDEO })
  type: LessonType;

  @ManyToOne(() => Session, (session) => session.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @OneToMany(() => Quiz, (quiz) => quiz.lesson)
  quizzes: Quiz[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}