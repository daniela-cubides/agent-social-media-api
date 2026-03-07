import { Injectable } from '@nestjs/common';
import { CreateAiContentDto } from './dto/create-ai-content.dto';
import { UpdateAiContentDto } from './dto/update-ai-content.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AiContent, AiContentDocument } from './schemas/ai-content.schema';
import { Model } from 'mongoose';

@Injectable()
export class AiContentService {

  constructor(
    @InjectModel(AiContent.name) private readonly aiContentModel:Model<AiContentDocument> 
  ){}

  create(createAiContentDto: CreateAiContentDto) {
    return this.aiContentModel.create(createAiContentDto);
  }

  findAll() {
    return this.aiContentModel.find().exec();
  }

  findOne(id: string) {
    return this.aiContentModel.findById(id).exec();
  }

  update(id: string, updateAiContentDto: UpdateAiContentDto) {
    return this.aiContentModel.findByIdAndUpdate(id, updateAiContentDto, { new: true });
  }

  remove(id: string) {
    return this.aiContentModel.findByIdAndDelete(id).exec();
  }
}
