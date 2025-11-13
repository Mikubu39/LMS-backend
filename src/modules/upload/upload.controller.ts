import {  Controller,  Post,  UploadedFile, UploadedFiles,  UseGuards,  UseInterceptors,  Delete,  Body,  ParseFilePipeBuilder, HttpStatus, } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UploadService } from './upload.service';
import { Express } from 'express';
import { RemoveImageDto } from './dtos/remove-image.dto';

@ApiTags('11. Upload (Utility)')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload một file ảnh (single)' })
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }}},
  })
  uploadImage(
    @UploadedFile(
      // --- THÊM ĐOẠN VALIDATION NÀY ---
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/, // Chỉ chấp nhận đuôi ảnh phổ biến
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // Giới hạn 5MB (tính bằng byte)
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // Trả về lỗi 422 nếu sai
        }),
    ) 
    file: Express.Multer.File
  ) {
    return this.uploadService.uploadImage(file);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload nhiều file ảnh (multiple)' })
  @ApiBody({
    schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string', format: 'binary' }}}},
  })
  uploadMultipleImages(
    @UploadedFiles(
      // Validate cho mảng file (NestJS hỗ trợ từ v9+)
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, 
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    ) 
    files: Express.Multer.File[]
  ) {
    return this.uploadService.uploadMultipleImages(files);
  }

  @Delete('image')
  @ApiOperation({ summary: 'Xóa một file ảnh khỏi Cloudinary' })
  removeImage(@Body() removeImageDto: RemoveImageDto) {
    return this.uploadService.removeImage(removeImageDto.public_id);
  }
}