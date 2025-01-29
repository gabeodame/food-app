import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@Controller('api/1/uploads')
export class UploadsController {
  constructor(private readonly fileUploadService: UploadsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 4 * 1024 * 1024, // Set file size limit to 2MB
      },
    }),
  )
  async uploadFileToS3(
    @UploadedFile() file: Express.Multer.File,
    @Body('service') service: string,
    @Body('entityId') entityId: string,
    @Body('fileType') fileType: string,
  ): Promise<{ fileUrl: string }> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    return await this.fileUploadService.uploadFileToS3(
      service,
      entityId,
      fileType,
      file,
    );
  }
}
