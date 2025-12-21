import { DataSource } from 'typeorm';
import { Topic } from '../../modules/topic/entity/topic.entity';

export async function seedTopics(dataSource: DataSource) {
  const repo = dataSource.getRepository(Topic);

  const topics = [
    { name: 'Chào hỏi', description: 'Chào hỏi cơ bản N5' },
    { name: 'Gia đình', description: 'Từ vựng về gia đình' },
    { name: 'Trường học', description: 'Từ vựng trường học' },
  ];

  for (const t of topics) {
    const exists = await repo.findOne({ where: { name: t.name } });
    if (!exists) {
      await repo.save(repo.create(t));
    }
  }

  console.log('✅ Seed topic N5 xong');
}
