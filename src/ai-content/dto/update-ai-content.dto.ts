import { PartialType } from '@nestjs/mapped-types';
import { CreateAiContentDto } from './create-ai-content.dto';

export class UpdateAiContentDto extends PartialType(CreateAiContentDto) {}
