import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Lesson } from '../../lessons/database/lesson.entity';
import { QuizResult } from './quiz-result.entity';
import { QuizQuestionAssignment } from './quiz-question-assignment.entity'; 

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  quiz_id: string;

  @Column({ length: 200 })
  title: string;

  @Column()
  duration: number; // Thời gian làm bài (phút)

  @Index()
  @Column({ type: 'uuid' })
  lesson_id: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.quizzes)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

 
  
  
  @OneToMany(() => QuizQuestionAssignment, (assignment) => assignment.quiz)
  questionAssignments: QuizQuestionAssignment[];
  
  @OneToMany(() => QuizResult, (result) => result.quiz)
  results: QuizResult[];
}