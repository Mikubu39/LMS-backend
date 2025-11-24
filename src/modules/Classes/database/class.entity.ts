import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, // 👈 Import thêm
} from 'typeorm';
import { Course } from '../../courses/database/courses.entity';
import { User } from '../../auth/database/user.entity';
import { Enrollment } from './enrollment.entity'; // 👈 Import Entity Enrollment

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

  @Column({ nullable: true })
  schedule: string;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'int', default: 30 })
  max_students: number;

  @Column({ type: 'enum', enum: ClassStatus, default: ClassStatus.PENDING })
  status: ClassStatus;

  @ManyToOne(() => Course, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  // 👇 THÊM QUAN HỆ NÀY ĐỂ ĐẾM SĨ SỐ
  @OneToMany(() => Enrollment, (enrollment) => enrollment.class)
  enrollments: Enrollment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}