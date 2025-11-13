// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // GIỮ LẠI: Dùng biến môi trường là tốt nhất
import { TypeOrmModule } from '@nestjs/typeorm';

// KẾT HỢP: Import tất cả các module từ cả hai nhánh
import { AuthModule } from './modules/auth/auth.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { CoursesModule } from './modules/courses/course.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { UploadModule } from './modules/upload/upload.module';
import { QuestionsModule } from './modules/questions/questions.module'; // <-- THÊM
import { LessonVideoModule } from './modules/lesson-video/lesson-video.module'
import {PostsModule} from './modules/posts/posts.module'
import { StudentModule } from './modules/student/student.module';
import { SubmissionModule } from './modules/submission/submission.module';
@Module({
  imports: [
    // GIỮ LẠI: ConfigModule để load file .env
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
    // KẾT HỢP: Dùng cấu hình TypeORM với process.env và cách load entity tự động
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      
      // GIỮ LẠI: Cách load entity tự động này tốt hơn
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      
      synchronize: true,
    }),
    
    // KẾT HỢP: Thêm tất cả các module chức năng từ cả hai nhánh
    AuthModule,
    QuizzesModule,
    CoursesModule,
    SessionsModule,
    LessonsModule,
    CloudinaryModule,
    UploadModule,
    QuestionsModule,
    LessonVideoModule,
    PostsModule,
    StudentModule,
    SubmissionModule
  ],
})
export class AppModule {}