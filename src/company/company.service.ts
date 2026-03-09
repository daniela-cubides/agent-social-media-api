import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    return this.companyModel.create(createCompanyDto);
  }

  findAll() {
    return this.companyModel.find().exec();
  }

  findOne(id: string) {
    return this.companyModel.findById(id).exec();
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true });
  }

  remove(id: string) {
    return this.companyModel.findByIdAndDelete(id).exec();
  }
}
