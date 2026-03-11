import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Express } from 'express';
import { memoryStorage } from 'multer';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'logos', maxCount: 10 }], {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() body: CreateCompanyDto,
    @UploadedFiles() files?: { logos?: Express.Multer.File[] },
  ) {
    const createCompanyDto = this.normalizeCompanyBody(body);
    return this.companyService.create(createCompanyDto, files);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'logos', maxCount: 10 }], {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() body: UpdateCompanyDto,
    @UploadedFiles() files?: { logos?: Express.Multer.File[] },
  ) {
    const updateCompanyDto = this.normalizeCompanyBody(body);
    return this.companyService.update(id, updateCompanyDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  private normalizeCompanyBody(
    body: CreateCompanyDto | UpdateCompanyDto,
  ) {
    const normalized: any = { ...body };

    const logosRaw = (body as any).logos ?? (body as any).logosMeta;

    normalized.colors = this.coerceArray(this.parseMaybeJson(body.colors));
    normalized.productsOrServices = this.coerceArray(this.parseMaybeJson(body.productsOrServices));
    normalized.keywords = this.coerceArray(this.parseMaybeJson(body.keywords));
    normalized.websiteLinks = this.coerceArray(this.parseMaybeJson(body.websiteLinks));
    normalized.logos = this.coerceArray(this.parseMaybeJson(logosRaw));
    normalized.fonts = this.parseMaybeJson(body.fonts);

    return normalized;
  }

  private parseMaybeJson(value: any) {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  private coerceArray(value: any) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [value];
  }
}
