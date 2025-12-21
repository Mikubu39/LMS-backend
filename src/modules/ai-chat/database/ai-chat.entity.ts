import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class AiChatSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // ID người dùng (giả lập)

  @Column()
  topic: string; // Chủ đề: Ví dụ "Đi mua sắm"

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => AiChatMessage, (message) => message.session)
  messages: AiChatMessage[];
}

@Entity()
export class AiChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string; // Nội dung tin nhắn

  @Column({ type: 'enum', enum: ['user', 'assistant'] })
  role: string;

  @Column({ type: 'text', nullable: true })
  correction: string; // Phần sửa lỗi (nếu có)

  @Column({ type: 'text', nullable: true })
  vietnameseTranslation: string; // Dịch nghĩa (AI trả về)

  @ManyToOne(() => AiChatSession, (session) => session.messages)
  session: AiChatSession;
}