import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Quiz } from './database/quiz.entity';
import { QuizQuestion } from './database/quiz-question.entity';
import { QuizResult } from './database/quiz-result.entity';
import { SubmitQuizDto } from './dtos/submit-quiz.dto';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { UpdateQuizDto } from './dtos/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz) private quizzesRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion) private questionsRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizResult) private resultsRepository: Repository<QuizResult>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const { questions, ...quizData } = createQuizDto;
    const newQuiz = this.quizzesRepository.create(quizData);
    const savedQuiz = await this.quizzesRepository.save(newQuiz);

    const questionsEntities = questions.map((q) =>
      this.questionsRepository.create({ ...q, quiz_id: savedQuiz.quiz_id }),
    );
    await this.questionsRepository.save(questionsEntities);

    return this.findOne(savedQuiz.quiz_id, true);
  }

  async findOne(id: number, includeCorrectAnswers = false): Promise<Quiz> {
    const quiz = await this.quizzesRepository.findOne({
      where: { quiz_id: id },
      relations: ['questions'],
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
    // Nếu không cần đáp án đúng (VD: cho học viên xem), thì loại bỏ trường đó
    if (!includeCorrectAnswers) {
        quiz.questions.forEach(q => delete (q as any).correct_answer);
    }
    return quiz;
  }
  
  async update(id: number, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizzesRepository.preload({
      quiz_id: id,
      ...updateQuizDto,
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
    return this.quizzesRepository.save(quiz);
  }

  async remove(id: number): Promise<{ message: string }> {
    const quiz = await this.findOne(id);
    await this.questionsRepository.delete({ quiz_id: id });
    await this.resultsRepository.delete({ quiz_id: id });
    await this.quizzesRepository.remove(quiz);
    return { message: `Quiz with ID ${id} has been deleted` };
  }

  async submitAndGradeQuiz(
    userId: number,
    quizId: number,
    submitQuizDto: SubmitQuizDto,
  ) {
    const questionIds = submitQuizDto.answers.map(a => a.question_id);
    const correctQuestions = await this.questionsRepository.find({
      where: { quiz_id: quizId, question_id: In(questionIds) },
    });

    if (correctQuestions.length === 0) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found or has no questions.`);
    }

    let correctAnswersCount = 0;
    submitQuizDto.answers.forEach((studentAnswer) => {
      const question = correctQuestions.find(
        (q) => q.question_id === studentAnswer.question_id,
      );
      if (question && question.correct_answer === studentAnswer.selected_answer) {
        correctAnswersCount++;
      }
    });

    const score = (correctAnswersCount / correctQuestions.length) * 100;

    const newResult = this.resultsRepository.create({
      user_id: userId,
      quiz_id: quizId,
      score,
    });
    await this.resultsRepository.save(newResult);

    return {
      quizId,
      totalQuestions: correctQuestions.length,
      correctAnswers: correctAnswersCount,
      score: parseFloat(score.toFixed(2)),
      message: 'Quiz submitted successfully!',
    };
  }
}