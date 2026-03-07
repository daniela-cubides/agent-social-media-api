import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiContentController } from './ai-content.controller';
import { AiContentService } from './ai-content.service';
import { AiContent, AiContentSchema } from './schemas/ai-content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiContent.name, schema: AiContentSchema },
    ]),
  ],
  controllers: [AiContentController],
  providers: [AiContentService],
})
export class AiContentModule {}
