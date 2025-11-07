import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestion } from '../quizzes/database/quiz-question.entity';
import { CreateBankQuestionDto, UpdateBankQuestionDto } from './dtos/questions.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuizQuestion)
    private questionsRepository: Repository<QuizQuestion>,
  ) {}

  create(dto: CreateBankQuestionDto) {
    const newQuestion = this.questionsRepository.create(dto);
    return this.questionsRepository.save(newQuestion);
  }

  findAll() {
    return this.questionsRepository.find();
  }

  async findOne(id: string) {
    const q = await this.questionsRepository.findOneBy({ question_id: id });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async update(id: string, dto: UpdateBankQuestionDto) {
    const question = await this.questionsRepository.preload({ question_id: id, ...dto });
    if (!question) throw new NotFoundException('Question not found');
    return this.questionsRepository.save(question);
  }

  async remove(id: string) {
    const q = await this.findOne(id);
    // Cần cẩn thận: Xóa câu hỏi này cũng sẽ tự động xóa nó khỏi các bài quiz (do onDelete: 'CASCADE')
    await this.questionsRepository.remove(q);
    return { message: 'Question removed from bank' };
  }
}