import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource } from 'typeorm';
import { Quiz } from './database/quiz.entity';
import { QuizQuestion } from './database/quiz-question.entity';
import { QuizResult } from './database/quiz-result.entity';
import { SubmitQuizDto } from './dtos/submit-quiz.dto';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { UpdateQuizDto } from './dtos/update-quiz.dto';
import { QuizQuestionAssignment } from './database/quiz-question-assignment.entity'; 
import { AssignQuestionDto } from './dtos/assign-question.dto'; 

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz) private quizzesRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion) private questionsRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizResult) private resultsRepository: Repository<QuizResult>,
    @InjectRepository(QuizQuestionAssignment) 
    private assignmentRepository: Repository<QuizQuestionAssignment>,
    private dataSource: DataSource,
  ) {}


  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const newQuiz = this.quizzesRepository.create(createQuizDto);
    return this.quizzesRepository.save(newQuiz);
  }

  async findAll(): Promise<Quiz[]> {
  return this.quizzesRepository.find();
} 
  async assignQuizQuestions(
    quizId: string,
    assignDto: AssignQuestionDto,
  ): Promise<QuizQuestionAssignment[]> {
    const { assignments } = assignDto; // Mảng các { question_id, order_index }
    const questionIds = assignments.map((a) => a.question_id);

    // Chạy tất cả các lệnh DB trong 1 transaction
    return this.dataSource.transaction(async (entityManager) => {
      // 1. Kiểm tra Quiz có tồn tại không
      const quiz = await entityManager.findOneBy(Quiz, { quiz_id: quizId });
      if (!quiz) throw new NotFoundException('Quiz not found');

      // 2. Kiểm tra TẤT CẢ question_id có tồn tại không (chỉ query nếu mảng không rỗng)
      let questionMap = new Map<string, QuizQuestion>();
      if (questionIds.length > 0) {
        const questions = await entityManager.find(QuizQuestion, {
          where: { question_id: In(questionIds) },
        });

        if (questions.length !== questionIds.length) {
          const foundIds = questions.map((q) => q.question_id);
          const notFound = questionIds.filter((id) => !foundIds.includes(id));
          throw new NotFoundException(`Questions not found: ${notFound.join(', ')}`);
        }
        questionMap = new Map(questions.map((q) => [q.question_id, q]));
      }

      // 3. XÓA tất cả các assignment CŨ của quiz này
      await entityManager.delete(QuizQuestionAssignment, {
        quiz: { quiz_id: quizId },
      });

      // 4. Nếu danh sách mới rỗng, ta dừng lại (đã xóa xong)
      if (assignments.length === 0) {
        return [];
      }

      // 5. TẠO các assignment MỚI
      const newAssignments = assignments.map((item) => {
        const question = questionMap.get(item.question_id);
        return entityManager.create(QuizQuestionAssignment, {
          quiz: quiz,
          question: question,
          order_index: item.order_index || 0,
        });
      });

      // 6. LƯU tất cả assignment mới vào DB
      return entityManager.save(QuizQuestionAssignment, newAssignments);
    });
  }
  

  async unassignQuestionFromQuiz(assignmentId: string): Promise<{ message: string }> {
    const assignment = await this.assignmentRepository.findOneBy({ assignment_id: assignmentId });
    if (!assignment) throw new NotFoundException('Assignment not found');
    
    await this.assignmentRepository.remove(assignment);
    return { message: 'Question unassigned from quiz' };
  }

 
  async findOne(id: string, includeCorrectAnswers = false): Promise<any> {
    // 1. Tìm quiz
    const quiz = await this.quizzesRepository.findOneBy({ quiz_id: id });
    if (!quiz) throw new NotFoundException(`Quiz with ID ${id} not found`);

    const assignments = await this.assignmentRepository.createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.question', 'question')
      .where('assignment.quiz_id = :quizId', { quizId: id })
      .orderBy('assignment.order_index', 'ASC')
      .getMany();

 
    const questions = assignments.map(a => {
      const questionData = a.question;
      if (!includeCorrectAnswers) {
        delete (questionData as any).correct_answer;
      }
      return {
        ...questionData,
        order_index: a.order_index,
        assignment_id: a.assignment_id, 
      };
    });

    return {
      ...quiz,
      questions: questions,
    };
  }
  
  
  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizzesRepository.preload({
      quiz_id: id,
      ...updateQuizDto,
    });
    if (!quiz) throw new NotFoundException(`Quiz with ID ${id} not found`);
    return this.quizzesRepository.save(quiz);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.dataSource.transaction(async (entityManager) => {
      const quiz = await entityManager.findOneBy(Quiz, { quiz_id: id });
      if (!quiz) throw new NotFoundException(`Quiz with ID ${id} not found`);
      

      await entityManager.delete(QuizResult, { quiz_id: id });
    
      await entityManager.delete(QuizQuestionAssignment, { quiz: { quiz_id: id } });
 
      await entityManager.remove(quiz);
    });
    return { message: `Quiz with ID ${id} has been deleted` };
  }
  
 
  async submitAndGradeQuiz(
  userId: string,
  quizId: string,
  submitQuizDto: SubmitQuizDto,
) {
  const quizAssignments = await this.assignmentRepository.find({
    where: { quiz: { quiz_id: quizId } },
    relations: ['question'],
  });


  const correctQuestions = quizAssignments.map((a) => a.question);

  if (correctQuestions.length === 0) {
    throw new NotFoundException(
      `Quiz with ID ${quizId} not found or has no questions.`,
    );
  }

  // Tạo danh sách ID hợp lệ để kiểm tra nhanh
  const validQuestionIds = correctQuestions.map((q) => q.question_id);

  let correctAnswersCount = 0;

  submitQuizDto.answers.forEach((studentAnswer) => {

    if (!validQuestionIds.includes(studentAnswer.question_id)) {
      return; 
    }

    // Tìm câu hỏi gốc để so sánh đáp án
    const question = correctQuestions.find(
      (q) => q.question_id === studentAnswer.question_id,
    );

    // So sánh đáp án
    if (question && question.correct_answer === studentAnswer.selected_answer) {
      correctAnswersCount++;
    }
  });

  // BƯỚC 3: Tính điểm
  const score = (correctAnswersCount / correctQuestions.length) * 100;

  // Lưu kết quả
  const newResult = this.resultsRepository.create({
      user_id: userId,
      quiz_id: quizId,
      lesson_item_id: submitQuizDto.lessonItemId, // 👈 LƯU THÊM CÁI NÀY
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

async getResultsByQuizId(quizId: string, lessonItemId?: string) {
    const whereCondition: any = { quiz_id: quizId };
    
    // Nếu có truyền lessonItemId thì lọc chính xác bài đó
    if (lessonItemId) {
      whereCondition.lesson_item_id = lessonItemId;
    }

    return this.resultsRepository.find({
      where: whereCondition,
      relations: ['user'], 
      order: { score: 'DESC' }
    });
  }
}