import { Controller, Post, Body, Get, Param, Query, Res } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { Response } from 'express';
@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('start')
  startSession(@Body() body: { userId: number; topic: string }) {
    return this.aiChatService.createSession(body.userId, body.topic);
  }

  @Post('talk')
  async talk(@Body() body: { sessionId: number; message: string }) {
    return this.aiChatService.chat(body.sessionId, body.message);
  }
  
  @Get('tts')
  async getAudio(
    @Query('text') text: string,
    @Query('lang') lang: string,
    @Res() res: Response,
  ) {
    try {
      const audioStream = await this.aiChatService.getTextToSpeech(text, lang || 'ja');
      res.set({
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
      });
      audioStream.pipe(res); // Truyền luồng âm thanh thẳng về cho Frontend
    } catch (error) {
      res.status(500).send('Error generating audio');
    }
  }
  
  @Get(':id')
  getSession(@Param('id') id: string) {
      return this.aiChatService.getSession(+id);
  }

  
}