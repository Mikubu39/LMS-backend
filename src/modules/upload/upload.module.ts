import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // Import CloudinaryModule
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CloudinaryModule, AuthModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}