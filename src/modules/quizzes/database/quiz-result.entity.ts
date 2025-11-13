import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../auth/database/user.entity';
import { Quiz } from './quiz.entity';

@Entity('quiz_results')
export class QuizResult {
  @PrimaryGeneratedColumn('uuid') 
  result_id: string; 

  @Index()
  @Column({ type: 'uuid' }) 
  quiz_id: string; 

  @Index()
  @Column()
  user_id: string;
  
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