import { Controller, Post, Body, Get, Patch, Delete, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from 'src/constant/enum';
import { RolesGuard } from '../../shared/guard/roles.guard';
import { CreateBankQuestionDto, UpdateBankQuestionDto } from './dtos/questions.dto';

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
}