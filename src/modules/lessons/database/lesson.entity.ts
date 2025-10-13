import { Course } from '../../courses/database/course.entity';
import { Quiz } from '../../quizzes/database/quiz.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  lesson_id: number;

  @Column({ length: 200 })
  title: string;

  @Column()
  course_id: number;

  @ManyToOne(() => Course, (course) => course.lessons)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Quiz, (quiz) => quiz.lesson)
  quizzes: Quiz[];
}