import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
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

  @Get(':companyId')
  findOne(@Param('companyId') companyId: string) {
    return this.companyService.findOne(companyId);
  }

  @Patch(':companyId')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'logos', maxCount: 10 }], {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('companyId') companyId: string,
    @Body() body: UpdateCompanyDto,
    @UploadedFiles() files?: { logos?: Express.Multer.File[] },
  ) {
    const updateCompanyDto = this.normalizeCompanyBody(body);
    return this.companyService.update(companyId, updateCompanyDto, files);
  }

  @Post(':companyId/logos')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'logos', maxCount: 10 }], {
      storage: memoryStorage(),
    }),
  )
  addLogos(
    @Param('companyId') companyId: string,
    @Body() body: { logosMeta?: any },
    @UploadedFiles() files?: { logos?: Express.Multer.File[] },
  ) {
    const logosMeta = this.coerceArray(this.parseMaybeJson(body?.logosMeta));
    return this.companyService.addLogos(companyId, files?.logos, logosMeta);
  }

  @Patch(':companyId/logos')
  updateLogoType(
    @Param('companyId') companyId: string,
    @Body() body: { key?: string; type?: string | null },
  ) {
    if (!body?.key) {
      throw new BadRequestException('key is required');
    }
    return this.companyService.updateLogoType(companyId, body.key, body.type);
  }

  @Patch(':companyId/logos/replace')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'logos', maxCount: 1 }], {
      storage: memoryStorage(),
    }),
  )
  replaceLogo(
    @Param('companyId') companyId: string,
    @Body() body: { key?: string; type?: string | null },
    @UploadedFiles() files?: { logos?: Express.Multer.File[] },
  ) {
    if (!body?.key) {
      throw new BadRequestException('key is required');
    }
    const file = files?.logos?.[0];
    if (!file) {
      throw new BadRequestException('logo file is required');
    }
    return this.companyService.replaceLogoFile(companyId, body.key, file, body.type);
  }

  @Delete(':companyId/logos')
  removeLogo(
    @Param('companyId') companyId: string,
    @Query('key') key?: string,
  ) {
    if (!key) {
      throw new BadRequestException('key is required');
    }
    return this.companyService.removeLogo(companyId, key);
  }

  @Delete(':companyId')
  remove(@Param('companyId') companyId: string) {
    return this.companyService.remove(companyId);
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
