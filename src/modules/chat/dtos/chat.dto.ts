// src/modules/chat/dtos/chat.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

// DTO dùng để khởi tạo cuộc trò chuyện
export class InitConversationDto {
  @ApiProperty({ 
    description: 'ID của người dùng mà bạn muốn bắt đầu trò chuyện (Giáo viên hoặc Học sinh)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  })
  @IsNotEmpty()
  @IsUUID()
  targetUserId: string;
}

// 👇 ĐÂY LÀ CLASS BẠN ĐANG THIẾU
export class SendMessageDto {
  @ApiProperty({ 
    description: 'ID của cuộc hội thoại (lấy từ API /chat/init)',
    example: 'b1f2bc99-9c0b-4ef8-bb6d-6bb9bd380a22'
  })
  @IsNotEmpty()
  @IsUUID()
  conversationId: string;

  @ApiProperty({ 
    description: 'Nội dung tin nhắn',
    example: 'Chào thầy, em cần hỏi về bài tập ạ.'
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}