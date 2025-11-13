import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonVideoDto } from './create-lesson-video.dto';

export class UpdateLessonVideoDto extends PartialType(CreateLessonVideoDto) {}
