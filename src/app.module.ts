
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
import { PostsModule } from './modules/posts/posts.module';
import { StudentModule } from './modules/student/student.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { ClassesModule } from './modules/classes/classes.module'; 
import { ChatModule } from './modules/chat/chat.module';
import { ProgressModule } from './modules/progress/progress.module';
import { AiChatModule } from './modules/ai-chat/ai-chat.module';
import { Kanji } from './modules/kanji/database/kanji.entity';

import { TopicModule } from './modules/topic/topic.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { KanjiModule } from './modules/kanji/kanji.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Chỉ dùng trong dev, không dùng trong prod
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
    PostsModule,
    StudentModule,
    SubmissionModule,
    ProgressModule,
    ChatModule,
    AiChatModule,
    KanjiModule,
    TopicModule,
    VocabularyModule,
  ],
})
export class AppModule {}
