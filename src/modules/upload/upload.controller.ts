import {  Controller,  Post,  UploadedFile,  UploadedFiles,  UseGuards,  UseInterceptors,  Delete,Body} from '@nestjs/common';
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
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }


  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10)) 
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload nhiều file ảnh (multiple)' })
  @ApiBody({
    schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string', format: 'binary' }}}},
  })
  uploadMultipleImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadService.uploadMultipleImages(files);
  }


  @Delete('image')
  @ApiOperation({ summary: 'Xóa một file ảnh khỏi Cloudinary' })
  removeImage(@Body() removeImageDto: RemoveImageDto) {
    return this.uploadService.removeImage(removeImageDto.public_id);
  }
}