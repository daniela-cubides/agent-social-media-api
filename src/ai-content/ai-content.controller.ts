import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiContentService } from './ai-content.service';
import { CreateAiContentDto } from './dto/create-ai-content.dto';
import { UpdateAiContentDto } from './dto/update-ai-content.dto';

@Controller('companies/:companyId/ai-content')
export class AiContentController {
  constructor(private readonly aiContentService: AiContentService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createAiContentDto: CreateAiContentDto,
  ) {
    return this.aiContentService.create(companyId, createAiContentDto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.aiContentService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.aiContentService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() updateAiContentDto: UpdateAiContentDto,
  ) {
    return this.aiContentService.update(companyId, id, updateAiContentDto);
  }

  @Delete(':id')
  remove(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.aiContentService.remove(companyId, id);
  }
}
