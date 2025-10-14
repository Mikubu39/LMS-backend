// src/modules/courses/database/courses.entity.ts

import { Session } from '../../sessions/database/session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  ALL_LEVELS = 'All Levels',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.ALL_LEVELS,
  })
  level: CourseLevel;

  // Mối quan hệ: Một Khóa học có nhiều Chương học (Session)
  @OneToMany(() => Session, (session) => session.course)
  sessions: Session[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
