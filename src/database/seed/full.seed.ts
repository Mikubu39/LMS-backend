import { DataSource } from 'typeorm';
import { Topic } from '../../modules/topic/entity/topic.entity';
import { Kanji } from '../../modules/kanji/database/kanji.entity';
import { Vocabulary } from '../../modules/vocabulary/entity/vocabulary.entity';

export async function seedAll(dataSource: DataSource) {
  const topicRepo = dataSource.getRepository(Topic);
  const kanjiRepo = dataSource.getRepository(Kanji);
  const vocabRepo = dataSource.getRepository(Vocabulary);

  const topic = await topicRepo.save(
    topicRepo.create({ name: 'JLPT N5 - Cơ bản' }),
  );

  const kanji = await kanjiRepo.find({ take: 2 });

  await vocabRepo.save(
    vocabRepo.create({
      word: '日本',
      meaning: 'Nhật Bản',
      topic,
      topic_id: topic.id,
      kanjiList: kanji,
    }),
  );

  console.log('✅ Seed FULL done');
}
