// src/modules/classes/database/class.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany, // 👈 Mới
  JoinTable,  // 👈 Mới
} from 'typeorm';
import { Course } from '../../courses/database/courses.entity';
import { User } from '../../auth/database/user.entity';
import { Enrollment } from './enrollment.entity';

export enum ClassStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  FINISHED = 'Finished',
  CANCELED = 'Canceled',
}

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  class_id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  

  @Column({ type: 'enum', enum: ClassStatus, default: ClassStatus.PENDING })
  status: ClassStatus;

  // 👇 THAY ĐỔI: Quan hệ nhiều - nhiều với Khóa học
  @ManyToMany(() => Course)
  @JoinTable({ name: 'class_courses' }) // Tên bảng phụ trong DB
  courses: Course[];

  // 👇 THAY ĐỔI: Quan hệ nhiều - nhiều với Giảng viên
  @ManyToMany(() => User)
  @JoinTable({ name: 'class_teachers' }) // Tên bảng phụ trong DB
  teachers: User[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.class)
  enrollments: Enrollment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}