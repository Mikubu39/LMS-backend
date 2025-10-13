import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/database/user.entity';
import { Quiz } from './quiz.entity';

@Entity('quiz_results')
export class QuizResult {
  @PrimaryGeneratedColumn()
  result_id: number;

  @Column()
  quiz_id: number;

  @Column()
  user_id: number;
  
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