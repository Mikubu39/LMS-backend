import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiChatSession, AiChatMessage } from './database/ai-chat.entity';
import axios from 'axios';

@Injectable()
export class AiChatService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    @InjectRepository(AiChatSession)
    private sessionRepo: Repository<AiChatSession>,
    @InjectRepository(AiChatMessage)
    private messageRepo: Repository<AiChatMessage>,
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Sử dụng Gemini 2.5 Flash cho tốc độ phản hồi nhanh
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  // 1. Tạo phiên hội thoại mới
  async createSession(userId: number, topic: string) {
    const session = this.sessionRepo.create({ userId, topic });
    return this.sessionRepo.save(session);
  }

  // 2. Gửi tin nhắn và nhận phản hồi từ AI
  async chat(sessionId: number, userText: string) {
    // Lấy session
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
      relations: ['messages'],
    });
    if (!session) throw new Error('Session not found');

    // Lưu tin nhắn User
    const userMsg = this.messageRepo.create({
      content: userText,
      role: 'user',
      session: session,
    });
    await this.messageRepo.save(userMsg);

    // Chuẩn bị lịch sử chat để gửi cho AI (để AI nhớ ngữ cảnh)
    const history = session.messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Tạo Prompt cho AI
    const systemInstruction = `
      Bạn là một giáo viên tiếng Nhật thân thiện (Sensei).
      Người dùng đang học tiếng Nhật về chủ đề: "${session.topic}".
      Nhiệm vụ:
      1. Trả lời hội thoại ngắn gọn, tự nhiên bằng tiếng Nhật.
      2. Kiểm tra ngữ pháp câu nói vừa rồi của người dùng.
      3. Trả về kết quả dưới dạng JSON thuần túy (không markdown) theo mẫu:
      {
        "reply": "Câu trả lời tiếng Nhật của bạn",
        "correction": "Giải thích lỗi sai bằng tiếng Việt (nếu đúng thì để null)",
        "translation": "Dịch câu trả lời của bạn sang tiếng Việt"
      }
    `;

    // Gọi Gemini API
    const chat = this.model.startChat({
      history: [
        ...history, // Lịch sử cũ
      ],
    });

    const result = await chat.sendMessage(systemInstruction + "\nUser nói: " + userText);
    const responseText = result.response.text();
    
    // Parse JSON từ AI (Xử lý trường hợp AI trả về dính dấu ```json)
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    let aiData;
    try {
      aiData = JSON.parse(cleanJson);
    } catch (e) {
      // Fallback nếu AI không trả về đúng JSON
      aiData = { reply: responseText, correction: null, translation: "" };
    }

    // Lưu tin nhắn AI
    const aiMsg = this.messageRepo.create({
      content: aiData.reply,
      role: 'assistant',
      correction: aiData.correction,
      vietnameseTranslation: aiData.translation,
      session: session,
    });
    await this.messageRepo.save(aiMsg);

    return aiMsg;
  }
  
  async getSession(id: number) {
      return this.sessionRepo.findOne({ where: { id }, relations: ['messages'] });
  }

  async getTextToSpeech(text: string, lang: string): Promise<any> {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream', // Quan trọng: Nhận dữ liệu dạng luồng (stream)
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'http://translate.google.com/',
        },
      });
      return response.data;
    } catch (error) {
      console.error('TTS Error:', error);
      throw new Error('Failed to fetch audio from Google');
    }
  }
}