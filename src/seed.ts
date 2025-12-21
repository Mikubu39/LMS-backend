import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  await seedService.seedJLPT('N5');
  await seedService.seedJLPT('N4');
  await seedService.seedJLPT('N3');
  await seedService.seedJLPT('N2');
  await seedService.seedJLPT('N1');

  await app.close();
}
bootstrap();
