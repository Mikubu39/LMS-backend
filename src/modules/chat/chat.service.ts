// src/modules/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 👇 Sửa import tại đây
import { Conversation } from './database/conversation.entity';
import { Message } from './database/message.entity';
import { User } from '../auth/database/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation) private convRepo: Repository<Conversation>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // ... (Giữ nguyên toàn bộ logic code phía dưới của bạn, không cần sửa gì thêm)
  async createOrGetConversation(currentUserId: string, targetUserId: string) {
    const query = this.convRepo.createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .leftJoinAndSelect('messages.sender', 'sender');

    const allConversations = await query.getMany();

    const existing = allConversations.find(c => {
      const pIds = c.participants.map(p => p.user_id); 
      return pIds.includes(currentUserId) && pIds.includes(targetUserId) && pIds.length === 2;
    });

    if (existing) {
      existing.messages.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
      return existing;
    }

    const user1 = await this.userRepo.findOneBy({ user_id: currentUserId } as any);
    const user2 = await this.userRepo.findOneBy({ user_id: targetUserId } as any);

    if (!user1 || !user2) throw new Error("User not found");

    const newConv = this.convRepo.create({
      type: 'private',
      participants: [user1, user2]
    });

    return this.convRepo.save(newConv);
  }

  async saveMessage(senderId: string, conversationId: string, content: string) {
    const conversation = await this.convRepo.findOneBy({ id: conversationId });
    const sender = await this.userRepo.findOneBy({ user_id: senderId } as any);

    const msg = this.msgRepo.create({ content, sender, conversation });
    return this.msgRepo.save(msg);
  }

  async getUsersForSidebar(currentUserId: string) {
     return this.userRepo.createQueryBuilder("user")
       .where("user.user_id != :id", { id: currentUserId })
       .select(['user.user_id', 'user.username', 'user.email', 'user.full_name', 'user.role']) 
       .getMany();
  }
}