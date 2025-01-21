import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly fileUploadService;
    constructor(fileUploadService: UploadsService);
    uploadFileToS3(file: Express.Multer.File, service: string, entityId: string, fileType: string): Promise<{
        fileUrl: string;
    }>;
}
