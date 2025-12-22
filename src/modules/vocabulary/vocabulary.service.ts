import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Vocabulary } from './entity/vocabulary.entity';
import { Topic } from '../topic/entity/topic.entity';
import { Kanji } from '../kanji/database/kanji.entity';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

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

    // Nếu có truyền kanjiIds thì tìm, không thì mảng rỗng
    const kanjiList = dto.kanjiIds?.length
      ? await this.kanjiRepo.find({
          where: { id: In(dto.kanjiIds) },
        })
      : [];

    const vocab = this.vocabRepo.create({
      word: dto.word,
      meaning: dto.meaning,
      topic,       // Gán quan hệ
      kanjiList,   // Gán quan hệ ManyToMany
    });

    return this.vocabRepo.save(vocab);
  }

  // GET BY TOPIC
  findByTopic(topicId: string) {
    return this.vocabRepo.find({
      where: { topic_id: topicId },
      relations: ['kanjiList'], // Load kèm Kanji để hiển thị
      order: { createdAt: 'ASC' } // Sắp xếp theo ngày tạo
    });
  }

  // GET ONE
  async findOne(id: string) {
    const vocab = await this.vocabRepo.findOne({
      where: { id },
      relations: ['kanjiList', 'topic'], // Load thêm Topic để biết từ này thuộc bài nào
    });

    if (!vocab) throw new NotFoundException('Vocabulary không tồn tại');
    return vocab;
  }

  // UPDATE (Thông tin cơ bản: word, meaning, topic)
  async update(id: string, dto: UpdateVocabularyDto) {
    const vocab = await this.findOne(id);

    // Nếu muốn đổi topic
    if (dto.topicId) {
      const topic = await this.topicRepo.findOne({ where: { id: dto.topicId } });
      if (!topic) throw new NotFoundException('Topic mới không tồn tại');
      vocab.topic = topic;
    }

    // Nếu muốn update lại list Kanji ngay tại đây (tuỳ chọn)
    if (dto.kanjiIds) {
       vocab.kanjiList = await this.kanjiRepo.find({ where: { id: In(dto.kanjiIds) } });
    }

    // Update các trường text
    if (dto.word) vocab.word = dto.word;
    if (dto.meaning) vocab.meaning = dto.meaning;

    return this.vocabRepo.save(vocab);
  }

  // UPDATE KANJI (Chuyên biệt)
  async updateKanji(vocabId: string, kanjiIds: number[]) {
    const vocab = await this.findOne(vocabId); // Đã có check exist bên trong findOne

    const kanjiList = await this.kanjiRepo.find({
      where: { id: In(kanjiIds) },
    });

    vocab.kanjiList = kanjiList;
    return this.vocabRepo.save(vocab);
  }

  // HARD DELETE
  async remove(id: string) {
    const vocab = await this.findOne(id);
    
    // Xóa cứng. 
    // TypeORM sẽ tự động xóa dòng liên kết trong bảng vocabulary_kanji
    await this.vocabRepo.remove(vocab);

    return { message: 'Đã xóa vĩnh viễn vocabulary thành công' };
  }
}