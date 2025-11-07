import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { QuizQuestionAssignment } from './quiz-question-assignment.entity';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  question_id: string;



  @Column('text')
  question_text: string;

  
  @Index()
  @Column({ length: 100, nullable: true })
  category: string; // Ví dụ: 'NestJS', 'TypeScript'

  @Column('text')
  option_a: string;
  
  @Column('text')
  option_b: string;

  @Column('text')
  option_c: string;

  @Column('text')
  option_d: string;

  @Column({ length: 1 })
  @Exclude() 
  correct_answer: string;

  // Thêm quan hệ M-N qua bảng trung gian
  @OneToMany(() => QuizQuestionAssignment, (assignment) => assignment.question)
  assignments: QuizQuestionAssignment[];
}