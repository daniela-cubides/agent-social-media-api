import { Injectable } from '@nestjs/common';
import { CreateAiContentDto } from './dto/create-ai-content.dto';
import { UpdateAiContentDto } from './dto/update-ai-content.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AiContent, AiContentDocument, AiContentStatus } from './schemas/ai-content.schema';
import { Model } from 'mongoose';
import { AiContentGeneratorService } from './ai-content-generator.service';

@Injectable()
export class AiContentService {
  constructor(
    @InjectModel(AiContent.name) private readonly aiContentModel: Model<AiContentDocument>,
    private readonly generator: AiContentGeneratorService,
  ) {}

  async create(companyId: string, createAiContentDto: CreateAiContentDto) {
    const { caption, imageS3Key, imageS3Url } = await this.generator.generate(
      companyId,
      createAiContentDto.prompt,
    );

    return this.aiContentModel.create({
      companyId,
      prompt: createAiContentDto.prompt,
      caption,
      imageS3Key,
      imageS3Url,
      status: AiContentStatus.Draft,
    });
  }

  findAll(companyId: string) {
    return this.aiContentModel.find({ companyId }).exec();
  }

  findOne(companyId: string, id: string) {
    return this.aiContentModel.findOne({ _id: id, companyId }).exec();
  }

  update(companyId: string, id: string, updateAiContentDto: UpdateAiContentDto) {
    return this.aiContentModel.findOneAndUpdate(
      { _id: id, companyId },
      updateAiContentDto,
      { returnDocument: 'after' },
    );
  }

  remove(companyId: string, id: string) {
    return this.aiContentModel.findOneAndDelete({ _id: id, companyId }).exec();
  }
}
