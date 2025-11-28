// ✅ src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import Modules
import { AuthModule } from './modules/auth/auth.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { CoursesModule } from './modules/courses/course.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { UploadModule } from './modules/upload/upload.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { LessonVideoModule } from './modules/lesson-video/lesson-video.module'
import { PostsModule } from './modules/posts/posts.module'
import { StudentModule } from './modules/student/student.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { ClassesModule } from './modules/classes/classes.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      
      // 🔴 SỬA TẠI ĐÂY: Xóa dòng entities: [...] cũ đi
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], <--- XÓA DÒNG NÀY
      
      // 🟢 THAY BẰNG: Tự động load entity từ các module con
      autoLoadEntities: true, 
      
      synchronize: true, // Tắt khi production
    }),
    
    // Các module chức năng
    AuthModule,
    QuizzesModule,
    ClassesModule,
    CoursesModule,
    SessionsModule,
    LessonsModule,
    CloudinaryModule,
    UploadModule,
    QuestionsModule,
    LessonVideoModule,
    PostsModule,
    StudentModule,
    SubmissionModule,
    
  ],
})
export class AppModule {}