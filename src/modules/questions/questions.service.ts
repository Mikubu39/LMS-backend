import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestion } from '../quizzes/database/quiz-question.entity';
import { CreateBankQuestionDto, UpdateBankQuestionDto } from './dtos/questions.dto';
import * as XLSX from 'xlsx';
import type { Express } from 'express';

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

  async importFromExcel(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames?.[0];
    if (!sheetName) {
      throw new BadRequestException('Excel file is empty');
    }

    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: null,
      raw: false,
      blankrows: false,
    });

    if (!rows.length) {
      throw new BadRequestException('No data found in Excel file');
    }

    const validAnswers = new Set(['a', 'b', 'c', 'd']);
    const entities: QuizQuestion[] = [];
    const errors: string[] = [];

    rows.forEach((row, index) => {
      const rowNumber = index + 2; // account for header row
      const questionText = row['question_text']?.toString().trim();
      const optionA = row['option_a']?.toString().trim();
      const optionB = row['option_b']?.toString().trim();
      const optionC = row['option_c']?.toString().trim();
      const optionD = row['option_d']?.toString().trim();
      const correctAnswer = row['correct_answer']?.toString().trim().toLowerCase();
      const category = row['category']?.toString().trim() ?? null;

      if (!questionText || !optionA || !optionB || !optionC || !optionD) {
        errors.push(`Row ${rowNumber}: missing required option/question data`);
        return;
      }

      if (!correctAnswer || !validAnswers.has(correctAnswer)) {
        errors.push(
          `Row ${rowNumber}: correct_answer must be one of 'a','b','c','d'`,
        );
        return;
      }

      const entity = this.questionsRepository.create({
        question_text: questionText,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_answer: correctAnswer,
        category: category || null,
      });

      entities.push(entity);
    });

    if (!entities.length) {
      throw new BadRequestException(
        errors.length
          ? `No rows imported. Errors: ${errors.join('; ')}`
          : 'No valid rows found in Excel file',
      );
    }

    await this.questionsRepository.save(entities);
    return {
      imported: entities.length,
      errors,
    };
  }
}