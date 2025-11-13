import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from 'src/modules/auth/database/user.entity';

export enum LessonStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity()
@Unique(['userId', 'lessonId'])
export class LessonProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  @Index()
  courseId: string; 

  @Column()
  @Index()
  lessonId: string; 

  @Column({ type: 'enum', enum: LessonStatus, default: LessonStatus.IN_PROGRESS })
  status: LessonStatus;

  @Column({ type: 'int', default: 0 })
  percentage: number;

  @Column({ type: 'int', nullable: true })
  lastPosition: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


