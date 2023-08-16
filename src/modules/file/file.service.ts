import { Inject, Injectable } from "@nestjs/common";
import { S3, config } from "aws-sdk";
import * as sharp from "sharp";
import { createHash } from "crypto";
import { ConfigType } from "@nestjs/config";
import { environments } from "../../config/env.config";

@Injectable()
export class FileService {
  private bucketName: string;
  private bucketS3: S3;
  private awsConfig: {
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
  } = {};
  constructor(
    @Inject(environments.KEY)
    private readonly configService: ConfigType<typeof environments>
  ) {
    if (this.configService.AWS_ACCESS_KEY)
      this.awsConfig.accessKeyId = this.configService.AWS_ACCESS_KEY;
    if (this.configService.AWS_SECRET_KEY)
      this.awsConfig.secretAccessKey = this.configService.AWS_SECRET_KEY;
    this.awsConfig.region = this.configService.AWS_DEFAULT_REGION;
    config.update({
      ...this.awsConfig,
    });
    this.bucketName = this.configService.STORAGE_S3_BUCKET;
    this.bucketS3 = new S3();
  }

  async uploadPublicFile(
    url: string,
    buffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const extension = fileName.toLowerCase().split(".").pop();
    const fileNameToSave =
      createHash("md5").update(Date.now().toString()).digest("hex") +
      formattedDate +
      "." +
      extension;
    buffer = mimeType.startsWith("image/")
      ? await this.optimizeBuffer(buffer)
      : buffer;
    const uploadResult = await this.bucketS3
      .upload({
        Bucket: this.bucketName,
        Body: buffer,
        Key: `${url}/${currentYear}/${currentMonth}/${fileNameToSave}`,
        ContentType: mimeType,
      })
      .promise();
    return uploadResult.Key;
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string
  ): Promise<string | null> {
    if (file == null) {
      return null;
    }
    return await this.uploadPublicFile(
      path,
      file.buffer,
      file.originalname,
      file.mimetype
    );
  }
  async deletePublicFile(fileKey: string): Promise<void> {
    await this.bucketS3
      .deleteObject({
        Bucket: this.bucketName,
        Key: fileKey,
      })
      .promise();
  }

  async optimizeBuffer(buffer: Buffer): Promise<Buffer> {
    const metadata = await sharp(buffer).metadata();
    if (metadata.width > 1000 || metadata.height > 1000) {
      return await sharp(buffer)
        .resize({ width: 1000, height: 1000, fit: sharp.fit.inside })
        .toBuffer();
    } else {
      return await sharp(buffer).toBuffer();
    }
  }
}
