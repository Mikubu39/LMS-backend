// ✅ src/modules/classes/database/enrollment.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column, Index } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../../auth/database/user.entity';

@Entity('enrollments')
@Index(['class', 'student'], { unique: true }) // Đảm bảo 1 người không vào 1 lớp 2 lần
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

 

  @CreateDateColumn()
  joined_at: Date;
}