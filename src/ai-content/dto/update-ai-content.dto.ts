import { AiContentStatus } from '../schemas/ai-content.schema';

export class UpdateAiContentDto {
  caption?: string;
  imageS3Url?: string;
  imageS3Key?: string;
  approvedAt?: Date;
  status?: AiContentStatus;
}
