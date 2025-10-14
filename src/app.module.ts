// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Sau này khi bạn tạo các module mới, bạn sẽ import chúng ở đây
// import { CoursesModule } from './courses/courses.module';
// import { SessionsModule } from './sessions/sessions.module';
// import { LessonsModule } from './lessons/lessons.module';
import { CoursesModule } from './modules/courses/course.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { LessonsModule } from './modules/lessons/lessons.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // <-- Mật khẩu XAMPP thường là rỗng
      database: 'lms_db', // <-- Tên database bạn đã tạo trong phpMyAdmin
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Tự động tạo/cập nhật bảng. Chỉ dùng khi phát triển.
    }),
    CoursesModule,
    SessionsModule,
    LessonsModule,

    // Các module chức năng sẽ được thêm vào đây
    // CoursesModule,
    // SessionsModule,
    // LessonsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
