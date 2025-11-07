import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../auth/database/user.entity';
import { Quiz } from './quiz.entity';

@Entity('quiz_results')
export class QuizResult {
  @PrimaryGeneratedColumn('uuid') // <-- SỬA
  result_id: string; // <-- SỬA

  @Index()
  @Column({ type: 'uuid' }) // <-- SỬA
  quiz_id: string; // <-- SỬA

  @Index()
  @Column()
  user_id: string; // <-- GIỮ NGUYÊN
  
  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @CreateDateColumn()
  submitted_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.results)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;
}