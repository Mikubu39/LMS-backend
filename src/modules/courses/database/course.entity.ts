import { User } from '../../auth/database/user.entity';
import { Lesson } from '../../lessons/database/lesson.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  course_id: number;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  description: string;

  @Column()
  teacher_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];
}