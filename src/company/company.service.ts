import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { S3Service } from '../storage/s3.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    private readonly s3: S3Service,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    files?: { logos?: Express.Multer.File[] },
  ) {
    const { logos, ...rest } = createCompanyDto;
    const company = await this.companyModel.create({ ...rest, logos: [] });

    const uploadedLogos = await this.uploadLogos(company.id, files?.logos, logos);
    if (uploadedLogos?.length) {
      company.logos = uploadedLogos;
      await company.save();
      return company;
    }

    if (Array.isArray(logos) && logos.length) {
      company.logos = logos;
      await company.save();
    }

    return company;
  }

  findAll() {
    return this.companyModel.find().exec();
  }

  findOne(id: string) {
    return this.companyModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    files?: { logos?: Express.Multer.File[] },
  ) {
    const updatePayload: UpdateCompanyDto = { ...updateCompanyDto };
    let logosToAppend: { $each: { file: string; type?: string; key?: string }[] } | undefined;

    if (files?.logos?.length) {
      const uploaded = await this.uploadLogos(id, files.logos, updateCompanyDto.logos);
      if (uploaded?.length) {
        logosToAppend = { $each: uploaded };
      }
      delete updatePayload.logos;
    }

    if (updatePayload.logos === undefined) {
      delete updatePayload.logos;
    }

    const updateOperation: any = { ...updatePayload };
    if (logosToAppend) {
      updateOperation.$push = { logos: logosToAppend };
    }

    return this.companyModel.findByIdAndUpdate(id, updateOperation, {
      returnDocument: 'after',
    });
  }

  remove(id: string) {
    return this.companyModel.findByIdAndDelete(id).exec();
  }

  private async uploadLogos(
    companyId: string,
    files: Express.Multer.File[] | undefined,
    logosMeta?: { type?: string }[],
  ) {
    if (!files?.length) {
      return undefined;
    }

    const uploads = await Promise.all(
      files.map((file, index) =>
        this.s3.uploadFile({
          prefix: `companies/${companyId}`,
          file,
        }).then((result) => ({
          file: result.url,
          key: result.key,
          type: logosMeta?.[index]?.type || undefined,
        })),
      ),
    );

    return uploads;
  }
}
