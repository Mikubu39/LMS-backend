import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vocabulary } from './entity/vocabulary.entity';
import { Topic } from '../topic/entity/topic.entity';
import { Kanji } from '../kanji/entity/kanji.entity';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private readonly vocabRepo: Repository<Vocabulary>,

    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,

    @InjectRepository(Kanji)
    private readonly kanjiRepo: Repository<Kanji>,
  ) {}

  // CREATE
  async create(dto: CreateVocabularyDto) {
    const topic = await this.topicRepo.findOne({
      where: { id: dto.topicId },
    });
    if (!topic) throw new NotFoundException('Topic không tồn tại');

    const kanjiList = dto.kanjiIds?.length
      ? await this.kanjiRepo.find({
          where: { id: In(dto.kanjiIds) },
        })
      : [];

    const vocab = this.vocabRepo.create({
      word: dto.word,
      meaning: dto.meaning,
      topic,
      topic_id: topic.id,
      kanjiList,
    });

    return this.vocabRepo.save(vocab);
  }

  // GET BY TOPIC
  findByTopic(topicId: string) {
    return this.vocabRepo.find({
      where: { topic_id: topicId },
      relations: ['kanjiList'],
    });
  }

  // GET ONE
  findOne(id: string) {
    return this.vocabRepo.findOne({
      where: { id },
      relations: ['kanjiList'],
    });
  }

  // UPDATE KANJI
  async updateKanji(vocabId: string, kanjiIds: number[]) {
    const vocab = await this.vocabRepo.findOne({
      where: { id: vocabId },
      relations: ['kanjiList'],
    });
    if (!vocab) throw new NotFoundException('Vocabulary không tồn tại');

    const kanjiList = await this.kanjiRepo.find({
      where: { id: In(kanjiIds) },
    });

    vocab.kanjiList = kanjiList;
    return this.vocabRepo.save(vocab);
  }
}
