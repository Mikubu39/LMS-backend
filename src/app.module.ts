import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { User } from './modules/auth/database/user.entity';
import { Quiz } from './modules/quizzes/database/quiz.entity';
import { QuizQuestion } from './modules/quizzes/database/quiz-question.entity';
import { QuizResult } from './modules/quizzes/database/quiz-result.entity';
import { UsersModule } from './modules/user/user.module';
import { Course } from './modules/courses/database/course.entity';
import { Lesson } from './modules/lessons/database/lesson.entity';

@Module({
  imports: [
    // 1. Cấu hình kết nối cơ sở dữ liệu (MySQL)
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Hatsune Miku', // Thay đổi mật khẩu của bạn ở đây
      database: 'lms_db',
      
      // 2. Tự động nhận diện và tải tất cả các entity
      entities: [
        User, 
        Course, 
        Lesson, 
        Quiz, 
        QuizQuestion, 
        QuizResult
      ],
      
      // 3. Tự động đồng bộ hóa schema (chỉ dùng cho môi trường development)
      synchronize: true,
    }),
    
    // 4. Import tất cả các module chức năng
    AuthModule,
    UsersModule,
    QuizzesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}