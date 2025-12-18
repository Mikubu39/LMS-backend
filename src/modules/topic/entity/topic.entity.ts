import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Vocabulary } from '../../vocabulary/entity/vocabulary.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => Vocabulary,
    (vocabulary: Vocabulary) => vocabulary.topic,
  )
  vocabularies: Vocabulary[];
}
