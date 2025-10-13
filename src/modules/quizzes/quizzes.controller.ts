import { Controller, Post, Body, Param, UseGuards, ParseIntPipe, Get, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuizzesService } from './quizzes.service';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { User, UserRole } from '../auth/database/user.entity';
import { SubmitQuizDto } from './dtos/submit-quiz.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guard/roles.guard';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { UpdateQuizDto } from './dtos/update-quiz.dto';

@ApiTags('3. Quizzes (Học viên & Giảng viên)')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Tạo một bài quiz mới (Admin, Teacher)' })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một bài quiz' })
  @ApiResponse({ status: 200, description: 'Trả về chi tiết quiz (không có đáp án đúng nếu là học viên)'})
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const includeAnswers = user.role === UserRole.ADMIN || user.role === UserRole.TEACHER;
    return this.quizzesService.findOne(id, includeAnswers);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cập nhật một bài quiz (Admin, Teacher)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Xóa một bài quiz (Admin, Teacher)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.remove(id);
  }

  @Post(':id/submit')
  @Roles(UserRole.STUDENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Nộp bài và chấm điểm một bài quiz (Học viên)' })
  @ApiParam({ name: 'id', description: 'ID của bài quiz' })
  submitQuiz(
    @Param('id', ParseIntPipe) quizId: number,
    @GetUser() user: User,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    return this.quizzesService.submitAndGradeQuiz(user.user_id, quizId, submitQuizDto);
  }
}