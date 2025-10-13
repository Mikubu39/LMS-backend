import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 1. Import ConfigModule
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { UsersModule } from './modules/user/user.module';
import { User } from './modules/auth/database/user.entity';
import { Course } from './modules/courses/database/course.entity';
import { Lesson } from './modules/lessons/database/lesson.entity';
import { Quiz } from './modules/quizzes/database/quiz.entity';
import { QuizQuestion } from './modules/quizzes/database/quiz-question.entity';
import { QuizResult } from './modules/quizzes/database/quiz-result.entity';

@Module({
  imports: [
    // 2. Thêm ConfigModule.forRoot() lên đầu danh sách imports
    ConfigModule.forRoot({
      isGlobal: true, // Giúp ConfigModule khả dụng ở mọi nơi trong ứng dụng
    }),
    
    // 3. Sửa lại TypeOrmModule để dùng process.env
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT), // Chuyển port từ string sang number
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      
      entities: [
        User, 
        Course, 
        Lesson, 
        Quiz, 
        QuizQuestion, 
        QuizResult
      ],
      
      synchronize: true,
    }),
    
    AuthModule,
    UsersModule,
    QuizzesModule,
  ],
})
export class AppModule {}