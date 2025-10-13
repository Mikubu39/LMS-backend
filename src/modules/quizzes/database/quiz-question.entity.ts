import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Exclude } from 'class-transformer';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn()
  question_id: number;

  @Column()
  quiz_id: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @Column('text')
  question_text: string;

  @Column('text')
  option_a: string;
  
  @Column('text')
  option_b: string;

  @Column('text')
  option_c: string;

  @Column('text')
  option_d: string;

  @Column({ length: 1 })
  @Exclude() // Không trả về đáp án đúng cho học viên
  correct_answer: string;
}