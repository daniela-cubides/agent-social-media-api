import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiContentService } from './ai-content.service';
import { CreateAiContentDto } from './dto/create-ai-content.dto';
import { UpdateAiContentDto } from './dto/update-ai-content.dto';

@Controller('ai-content')
export class AiContentController {
  constructor(private readonly aiContentService: AiContentService) {}

  @Post()
  create(@Body() createAiContentDto: CreateAiContentDto) {
    return this.aiContentService.create(createAiContentDto);
  }

  @Get()
  findAll() {
    return this.aiContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiContentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiContentDto: UpdateAiContentDto) {
    return this.aiContentService.update(id, updateAiContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiContentService.remove(id);
  }
}
