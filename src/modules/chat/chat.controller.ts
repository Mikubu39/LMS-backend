// src/chat/chat.controller.ts
import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { InitConversationDto, SendMessageDto } from './dtos/chat.dto';
import { AuthGuard } from '@nestjs/passport'; 
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('09. Chat System') // 1. Gom nhóm API vào mục Chat
@ApiBearerAuth('JWT-auth')  // 2. Yêu cầu có Token
@UseGuards(AuthGuard('jwt')) 
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('users')
  @ApiOperation({ 
    summary: 'Lấy danh sách người dùng để Chat',
    description: 'Trả về danh sách người dùng (trừ bản thân) để hiển thị ở sidebar chat.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách người dùng thành công.',
    schema: {
      example: [
        {
          "user_id": "uuid-1",
          "full_name": "Nguyễn Văn A",
          "role": "TEACHER",
          "avatar": "url..."
        }
      ]
    }
  })
  getUsers(@Req() req) {
    // Lưu ý: Đảm bảo req.user.user_id khớp với JWT Strategy của bạn
    return this.chatService.getUsersForSidebar(req.user.user_id);
  }

  @Post('init')
  @ApiOperation({ 
    summary: 'Tạo hoặc Lấy cuộc hội thoại 1-1',
    description: 'Nếu chưa có cuộc trò chuyện với targetUser -> Tạo mới. Nếu có rồi -> Trả về lịch sử chat cũ.'
  })
  @ApiBody({ type: InitConversationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Thông tin cuộc hội thoại kèm tin nhắn.',
    schema: {
      example: {
        "id": "conv-uuid",
        "type": "private",
        "participants": [
          { "user_id": "me", "full_name": "Me" },
          { "user_id": "target", "full_name": "Target" }
        ],
        "messages": [
          {
            "id": "msg-1",
            "content": "Hello",
            "created_at": "2024-01-01T10:00:00Z",
            "sender": { "user_id": "me", "full_name": "Me" }
          }
        ]
      }
    } 
  })
  initConversation(@Body() dto: InitConversationDto, @Req() req) {
    return this.chatService.createOrGetConversation(req.user.user_id, dto.targetUserId);
  }
  @Post('message')
  @ApiOperation({ 
    summary: '[TEST] Gửi tin nhắn qua API REST',
    description: 'API này giúp test logic lưu tin nhắn vào DB mà không cần kết nối Socket Client.' 
  })
  @ApiResponse({ status: 201, description: 'Tin nhắn đã được lưu thành công' })
  async sendMessage(@Body() dto: SendMessageDto, @Req() req) {
    // Gọi service lưu vào DB
    return this.chatService.saveMessage(
      req.user.user_id, // Lấy ID người gửi từ Token
      dto.conversationId, 
      dto.content
    );
  }
}