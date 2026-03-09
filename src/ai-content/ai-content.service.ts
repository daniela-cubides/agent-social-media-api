import { Injectable } from '@nestjs/common';
import { CreateAiContentDto } from './dto/create-ai-content.dto';
import { UpdateAiContentDto } from './dto/update-ai-content.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AiContent, AiContentDocument, AiContentStatus } from './schemas/ai-content.schema';
import { Model } from 'mongoose';

@Injectable()
export class AiContentService {

  constructor(
    @InjectModel(AiContent.name) private readonly aiContentModel:Model<AiContentDocument> 
  ){}

  create(companyId: string, createAiContentDto: CreateAiContentDto) {
    return this.aiContentModel.create({
      companyId,
      prompt: createAiContentDto.prompt,
      caption: 'PENDING_AI',
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
      { new: true },
    );
  }

  remove(companyId: string, id: string) {
    return this.aiContentModel.findOneAndDelete({ _id: id, companyId }).exec();
  }
}
