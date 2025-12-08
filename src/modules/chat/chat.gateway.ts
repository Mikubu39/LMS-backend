// src/chat/chat.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } }) 
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // 1. Client tham gia vào phòng chat (room = conversationId)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() conversationId: string, @ConnectedSocket() client: Socket) {
    client.join(conversationId);
    console.log(`Client ${client.id} joined room ${conversationId}`);
  }

  // 2. Client gửi tin nhắn
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: { conversationId: string, senderId: string, content: string }) {
    // Lưu DB
    const savedMsg = await this.chatService.saveMessage(payload.senderId, payload.conversationId, payload.content);
    
    // Gửi sự kiện 'receiveMessage' cho TẤT CẢ mọi người trong phòng (bao gồm cả người gửi để cập nhật UI)
    this.server.to(payload.conversationId).emit('receiveMessage', savedMsg);
  }
}