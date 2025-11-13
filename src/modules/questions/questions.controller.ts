import { Controller, Post, Body, Get, Patch, Delete, Param, UseGuards, ParseUUIDPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from 'src/constant/enum';
import { RolesGuard } from '../../shared/guard/roles.guard';
import { CreateBankQuestionDto, UpdateBankQuestionDto } from './dtos/questions.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

@ApiTags('07. Question Bank')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.TEACHER)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo câu hỏi mới vào ngân hàng' })
  create(@Body() dto: CreateBankQuestionDto) {
    return this.questionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Xem tất cả câu hỏi trong ngân hàng' })
  findAll() {
    return this.questionsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật một câu hỏi trong ngân hàng' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBankQuestionDto) {
    return this.questionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một câu hỏi khỏi ngân hàng' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionsService.remove(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import danh sách câu hỏi từ tệp Excel (.xlsx)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Tệp Excel (.xlsx) chứa các cột: question_text, option_a, option_b, option_c, option_d, correct_answer, category (optional)',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Import thành công',
    schema: {
      example: {
        imported: 10,
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Tệp không hợp lệ hoặc dữ liệu trống',
  })
  importFromExcel(@UploadedFile() file: Express.Multer.File) {
    return this.questionsService.importFromExcel(file);
  }
}