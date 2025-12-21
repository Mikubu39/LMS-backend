import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Topic } from '../../topic/entity/topic.entity';
import { Kanji } from '../../kanji/entity/kanji.entity';

@Entity('vocabularies')
export class Vocabulary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  word: string;

  @Column()
  meaning: string;

  // 🔹 Topic (1 - N)
  @ManyToOne(
    () => Topic,
    (topic) => topic.vocabularies,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @Column()
  topic_id: string;

  // 🔥 Kanji (N - N)
  @ManyToMany(
    () => Kanji,
    (kanji) => kanji.vocabularies,
    { cascade: false },
  )
  @JoinTable({
    name: 'vocabulary_kanji',
    joinColumn: {
      name: 'vocabulary_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'kanji_id',
      referencedColumnName: 'id',
    },
  })
  kanjiList: Kanji[];
}
