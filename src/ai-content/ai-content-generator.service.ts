import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { GoogleGenAI } from '@google/genai';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../company/schemas/company.schema';
import { S3Service } from '../storage/s3.service';

const captionAgent = new Agent({
  id: 'caption-agent',
  name: 'caption-agent',
  instructions:
    'You are a social media copywriter. Write a single short caption. Return only the final caption text.',
  model: google('gemini-2.5-flash'),
});

@Injectable()
export class AiContentGeneratorService {
  private genAI?: GoogleGenAI;

  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    private readonly s3: S3Service,
  ) {
  }

  private getGenAI() {
    if (!this.genAI) {
      this.genAI = new GoogleGenAI({
        apiKey:
          process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
          process.env.GOOGLE_API_KEY ??
          '',
      });
    }
    return this.genAI;
  }

  private getImageExtension(mimeType?: string) {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      default:
        return 'bin';
    }
  }

  private selectLogoUrl(company: Company): string | undefined {
    const logos = company.logos ?? [];
    if (!logos.length) {
      return undefined;
    }

    const preferred = logos.find((logo) => {
      const type = logo.type?.toLowerCase();
      return type === 'principal' || type === 'primary' || type === 'main' || type === 'logo';
    });

    const selected = preferred ?? logos[0];
    if (!selected?.file) {
      return undefined;
    }

    if (selected.file.startsWith('http://') || selected.file.startsWith('https://')) {
      return selected.file;
    }

    return this.s3.buildPublicUrl(selected.file);
  }

  private buildCompanyContext(company: Company) {
    return [
      `Company name: ${company.name}`,
      company.description ? `Description: ${company.description}` : undefined,
      company.brandVoice ? `Brand voice: ${company.brandVoice}` : undefined,
      company.productsOrServices?.length
        ? `Products/services: ${company.productsOrServices.join(', ')}`
        : undefined,
      company.keywords?.length ? `Keywords: ${company.keywords.join(', ')}` : undefined,
      company.websiteLinks?.length
        ? `Website links: ${company.websiteLinks.join(', ')}`
        : undefined,
      company.colors?.length
        ? `Brand colors: ${company.colors.map((c) => `${c.type}:${c.hex}`).join(', ')}`
        : undefined,
    ]
      .filter(Boolean)
      .join('\n');
  }

  async generate(companyId: string, prompt?: string) {
    const company = await this.companyModel.findById(companyId).exec();
    if (!company) {
      throw new NotFoundException(`Company ${companyId} not found`);
    }

    const companyContext = this.buildCompanyContext(company);
    const idea = prompt?.trim();
    const captionPrompt = [
      companyContext,
      idea ? `Idea: ${idea}` : undefined,
      'Write one short social media caption (max 25 words). Return only the caption.',
    ]
      .filter(Boolean)
      .join('\n');

    const captionResult = await captionAgent.generate(captionPrompt);
    const caption = captionResult.text?.trim() || 'PENDING_AI';

    const imagePrompt = [
      'Create a simple social media image.',
      `Caption: "${caption}"`,
      company.colors?.length
        ? `Use these brand colors: ${company.colors.map((c) => c.hex).join(', ')}`
        : undefined,
      (() => {
        const logoUrl = this.selectLogoUrl(company);
        if (!logoUrl) {
          return undefined;
        }
        return [
          `Use this company logo: ${logoUrl}.`,
          'If you include it, preserve the logo with minimal alteration:',
          'do not stylize, do not change colors, keep aspect ratio, and keep it readable.',
          'Place it subtly (e.g., a corner) and adapt it without distortion.',
        ].join(' ');
      })(),
    ]
      .filter(Boolean)
      .join(' ');

    let imageS3Url: string | undefined;
    let imageS3Key: string | undefined;

    try {
      const imageResponse = await this.getGenAI().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: imagePrompt,
      });
      const parts = imageResponse.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((part) => part.inlineData);
      const imageBase64 = imagePart?.inlineData?.data;
      const imageMimeType = imagePart?.inlineData?.mimeType;

      if (imageBase64) {
        const extension = this.getImageExtension(imageMimeType);
        const contentType = imageMimeType || 'application/octet-stream';
        const body: Buffer = Buffer.from(imageBase64, 'base64');

        const key = `ai-content/${Date.now()}-${randomUUID()}.${extension}`;

        const upload = await this.s3.uploadBuffer({
          key,
          body,
          contentType,
        });

        imageS3Key = upload.key;
        imageS3Url = upload.url;
      }
    } catch {
      // Image generation is optional; continue without it.
    }

    return { caption, imageS3Key, imageS3Url };
  }
}
