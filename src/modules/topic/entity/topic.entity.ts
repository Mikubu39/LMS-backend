import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Vocabulary } from '../../vocabulary/entity/vocabulary.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  // N5, N4, N3...
  @Column({ default: 'N5' })
  level: string;

  @OneToMany(
    () => Vocabulary,
    (vocabulary) => vocabulary.topic,
    { cascade: true },
  )
  vocabularies: Vocabulary[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ✅ Soft delete
  @DeleteDateColumn()
  deletedAt?: Date;
}
