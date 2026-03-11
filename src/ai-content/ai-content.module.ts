import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiContentController } from './ai-content.controller';
import { AiContentService } from './ai-content.service';
import { AiContent, AiContentSchema } from './schemas/ai-content.schema';
import { Company, CompanySchema } from '../company/schemas/company.schema';
import { AiContentGeneratorService } from './ai-content-generator.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiContent.name, schema: AiContentSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
    StorageModule,
  ],
  controllers: [AiContentController],
  providers: [AiContentService, AiContentGeneratorService],
})
export class AiContentModule {}
