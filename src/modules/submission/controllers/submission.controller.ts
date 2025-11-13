import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubmissionService } from '../services/submission.service';
import { CreateSubmissionDto } from '../dtos/request/create-submission.dto';
import { SearchSubmissionDto } from '../dtos/request/search-submission.dto';
import { SubmissionResponseDto } from '../dtos/response/submission-response.dto';
import { PaginatedSubmissionsResponseDto } from '../dtos/response/paginated-submissions-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../shared/guard/roles.guard';
import type { AuthenticatedRequest } from '../../../shared//types';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/constant/enum';
@ApiTags('10. Submissions (Student & Admin)')
@Controller()
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  
  @Post('submissions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Nộp bài link Git' })
  @ApiBody({
    type: CreateSubmissionDto,
    examples: {
      example1: {
        value: {
          gitLink: 'https://github.com/username/project-repo.git',
          description: 'Đây là bài tập về API NestJS với TypeORM và MySQL',
        },
        description: 'Nộp bài với đầy đủ thông tin',
      },
      example2: {
        value: {
          gitLink: 'https://github.com/username/another-repo.git',
        },
        description: 'Nộp bài chỉ với link Git',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Nộp bài thành công', type: SubmissionResponseDto })
  @ApiResponse({ status: 400, description: 'Link Git không hợp lệ' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<SubmissionResponseDto> {
    const userId = req.user!.user_id;
    return this.submissionService.create(createSubmissionDto, userId);
  }

  // User: Xem danh sách bài nộp của mình
  @Get('submissions/my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xem danh sách bài nộp của mình' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công', type: [SubmissionResponseDto] })
  async getMySubmissions(
    @Request() req: AuthenticatedRequest,
  ): Promise<SubmissionResponseDto[]> {
    const userId = req.user!.user_id;
    return this.submissionService.findByStudentId(userId);
  }

  // Admin: Xem danh sách bài nộp (tìm kiếm, phân trang)
  @Get('admin/submissions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Danh sách bài nộp (tìm kiếm + phân trang)' })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm theo gitLink, description, student.fullName, student.email' })
  @ApiQuery({ name: 'studentId', required: false, description: 'Lọc theo ID học viên' })
  @ApiQuery({ name: 'gitLink', required: false, description: 'Lọc theo link Git' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'reviewed', 'rejected', 'approved'], description: 'Lọc theo trạng thái' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công', type: PaginatedSubmissionsResponseDto })
  async findAll(
    @Query() searchDto: SearchSubmissionDto,
  ): Promise<PaginatedSubmissionsResponseDto> {
    return this.submissionService.findAll(searchDto);
  }

  // Admin: Xem chi tiết bài nộp
  @Get('admin/submissions/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Chi tiết bài nộp' })
  @ApiParam({ name: 'id', description: 'ID bài nộp' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công', type: SubmissionResponseDto })
  @ApiResponse({ status: 404, description: 'Bài nộp không tồn tại' })
  async findOne(@Param('id') id: string): Promise<SubmissionResponseDto> {
    return this.submissionService.findOne(id);
  }
}

