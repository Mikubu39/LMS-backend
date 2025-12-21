import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Vocabulary } from '../../vocabulary/entity/vocabulary.entity';

@Entity('kanji')
export class Kanji {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kanji: string;

  @Column({ nullable: true })
  onyomi: string;

  @Column({ nullable: true })
  kunyomi: string;

  @Column('simple-array')
  meanings: string[];

  @Column()
  jlpt: string;

  // 🔥 BẮT BUỘC PHẢI CÓ
  @ManyToMany(
    () => Vocabulary,
    (vocabulary) => vocabulary.kanjiList,
  )
  vocabularies: Vocabulary[];
}
