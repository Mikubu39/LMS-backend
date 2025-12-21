import { DataSource } from 'typeorm';
import { Kanji } from 'src/modules/kanji/entity/kanji.entity';
import * as fs from 'fs';
import * as path from 'path';

export async function seedKanji(dataSource: DataSource) {
  const repo = dataSource.getRepository(Kanji);

  const filePath = path.join(__dirname, 'kanji.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const kanjiList = JSON.parse(raw);

  for (const k of kanjiList) {
    const exists = await repo.findOne({ where: { kanji: k.kanji } });
    if (exists) continue;

    const kanji = repo.create(k);
    await repo.save(kanji);
  }

  console.log('✅ Seed Kanji done');
}
