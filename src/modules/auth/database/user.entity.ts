// src/modules/users/database/user.entity.ts
import { Exclude } from 'class-transformer';
import { UserRole } from 'src/constant/enum';
import { Course } from '../../courses/database/courses.entity'; // Import Course
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  @Exclude()
  password: string;

  @Column({ length: 20, nullable: true })
  phone: string;
  
  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  gender?: string;
  
  @Column({ length: 255, nullable: true })
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  @Exclude()
  hashed_refresh_token: string;

  // --- MỚI: DANH SÁCH KHÓA HỌC DO USER NÀY DẠY ---
 // @OneToMany(() => Course, (course) => course.instructor)
  //courses: Course[];
}