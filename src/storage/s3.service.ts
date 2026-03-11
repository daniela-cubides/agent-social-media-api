import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import path from 'path';
import { Express } from 'express';

export interface S3UploadResult {
  key: string;
  url: string;
}

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region?: string;

  constructor() {
    this.region = process.env.AWS_REGION;
    this.client = new S3Client({ region: this.region });
    this.bucket =
      process.env.S3_BUCKET_NAME ||
      process.env.S3_BUCKET ||
      process.env.AWS_S3_BUCKET ||
      '';
  }

  async uploadBuffer(params: {
    key: string;
    body: Buffer;
    contentType?: string;
  }): Promise<S3UploadResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.getBucket(),
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType || 'application/octet-stream',
      }),
    );

    return {
      key: params.key,
      url: this.buildPublicUrl(params.key),
    };
  }

  async uploadFile(params: {
    prefix: string;
    file: Express.Multer.File;
    extensionOverride?: string;
  }): Promise<S3UploadResult> {
    const key = this.buildKey(params.prefix, params.file.originalname, params.extensionOverride);
    return this.uploadBuffer({
      key,
      body: params.file.buffer,
      contentType: params.file.mimetype,
    });
  }

  buildKey(prefix: string, originalName?: string, extensionOverride?: string) {
    const safePrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
    const safeName = originalName ? this.sanitizeFilename(originalName) : randomUUID();
    const baseName = originalName ? path.parse(safeName).name : safeName;
    const ext =
      extensionOverride ??
      (originalName ? path.extname(safeName).replace('.', '') : '');
    const suffix = ext ? `.${ext}` : '';
    return `${safePrefix}${Date.now()}-${baseName}${suffix}`;
  }

  buildPublicUrl(key: string) {
    const bucket = this.getBucket();
    if (this.region) {
      return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }

  private getBucket() {
    if (!this.bucket) {
      throw new Error(
        'S3 bucket is not configured. Set S3_BUCKET_NAME (or S3_BUCKET/AWS_S3_BUCKET).',
      );
    }
    return this.bucket;
  }

  private sanitizeFilename(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
  }
}
