import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { QuizQuestion } from './quiz-question.entity'
import { Lesson } from '../../lessons/database/lesson.entity';
import { QuizResult } from './quiz-result.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  quiz_id: number;

  @Column({ length: 200 })
  title: string;

  @Column()
  duration: number; // Thời gian làm bài (phút)

  @Column()
  lesson_id: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.quizzes)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @OneToMany(() => QuizQuestion, (question) => question.quiz)
  questions: QuizQuestion[];
  
  @OneToMany(() => QuizResult, (result) => result.quiz)
  results: QuizResult[];
}