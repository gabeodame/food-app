import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadsService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFileToS3(
    service: string,
    entityId: string,
    fileType: string,
    file: Express.Multer.File,
  ): Promise<{ fileUrl: string }> {
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const fileKey = `${service}/${fileType}/${entityId}/${file.originalname}`;

    console.log('Uploading file:', fileKey);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ServerSideEncryption: 'AES256',
    };

    try {
      // Upload and overwrite the existing file
      const uploadResult = await this.s3.upload(params).promise();

      return {
        fileUrl: uploadResult.Location,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }

  async deleteFileFromS3(
    service: string,
    entityId: string,
    fileType: string,
    fileName: string,
  ): Promise<void> {
    const fileKey = `${service}/${fileType}/${entityId}/${fileName}`;

    console.log('Deleting file:', fileKey);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileKey,
    };

    try {
      await this.s3.deleteObject(params).promise();
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Error deleting file');
    }
  }
}
