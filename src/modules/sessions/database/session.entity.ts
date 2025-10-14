// src/modules/sessions/database/session.entity.ts

import { Course } from '../../courses/database/courses.entity';
import { Lesson } from '../../lessons/database/lesson.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  // Mối quan hệ: Nhiều Session thuộc về MỘT Course
  @ManyToOne(() => Course, (course) => course.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  // Mối quan hệ: MỘT Session có NHIỀU Lesson
  @OneToMany(() => Lesson, (lesson) => lesson.session)
  lessons: Lesson[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
