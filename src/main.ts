// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Bật CORS cho phép ReactJS gọi API
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ✅ Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ==========================
  // ✅ SWAGGER
  // ==========================
  const config = new DocumentBuilder()
    .setTitle('LMS E-Learning API')
    .setDescription(
      'Tài liệu API đầy đủ cho Hệ thống Học trực tuyến (LMS) – Kanji, Vocabulary, JLPT.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // ==========================
  // ✅ SEED DATABASE
  // ==========================
  const dataSource = app.get(DataSource);

  if (process.env.SEED === 'true') {
    console.log('🌱 Seeding database...');

    const { seedKanji } = await import('./database/seed/kanji.seed');
    const { seedAll } = await import('./database/seed/full.seed');

    await seedKanji(dataSource); // 2000 Kanji JLPT
    await seedAll(dataSource);   // Topic + Vocabulary mẫu

    console.log('✅ Seed completed');
  }

  await app.listen(3000);
  console.log(`🚀 Server running at http://localhost:3000`);
  console.log(`📘 Swagger docs at http://localhost:3000/api-docs`);
}

bootstrap();
