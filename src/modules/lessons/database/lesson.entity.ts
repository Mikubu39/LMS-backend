// src/modules/lessons/database/lesson.entity.ts
import { Session } from '../../sessions/database/session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LessonType {
  VIDEO = 'Video',
  TEXT = 'Text',
  QUIZ = 'Quiz',
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int', default: 0 })
  duration: number; // Thời lượng bài học tính bằng giây

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'enum', enum: LessonType, default: LessonType.VIDEO })
  type: LessonType;

  // Mối quan hệ: Nhiều Lesson thuộc về MỘT Session
  @ManyToOne(() => Session, (session) => session.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
