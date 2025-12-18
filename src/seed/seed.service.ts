import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kanji } from 'src/modules/kanji/entity/kanji.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Kanji)
    private kanjiRepo: Repository<Kanji>,
  ) {}

  async seedJLPT(level: string) {
    const filePath = path.join(
      process.cwd(),
      `src/seed/data/jlpt_${level.toLowerCase()}.json`,
    );

    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    let count = 0;

    for (const item of data) {
      const exists = await this.kanjiRepo.findOne({
        where: { kanji: item.kanji },
      });
      if (exists) continue;

      const kanji = this.kanjiRepo.create({
        kanji: item.kanji,
        onyomi: item.onyomi,
        kunyomi: item.kunyomi,
        meanings: item.meanings,
        jlpt: item.jlpt,
      });

      await this.kanjiRepo.save(kanji);
      count++;
    }

    console.log(`✔ Seed ${count} kanji JLPT ${level}`);
  }
}
