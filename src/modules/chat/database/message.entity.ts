// src/modules/chat/database/message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/database/user.entity'; // Kiểm tra lại đường dẫn User
import { Conversation } from './conversation.entity'; // 👇 Import Conversation từ file mới

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  // 🔑 FK UUID rõ ràng
  @Column({ type: 'uuid' })
  senderUserId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'senderUserId', referencedColumnName: 'user_id' })
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  conversation: Conversation;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_read: boolean;
}
