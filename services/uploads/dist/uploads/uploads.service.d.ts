export declare class UploadsService {
    private s3;
    constructor();
    uploadFileToS3(service: string, entityId: string, fileType: string, file: Express.Multer.File): Promise<{
        fileUrl: string;
    }>;
    deleteFileFromS3(service: string, entityId: string, fileType: string, fileName: string): Promise<void>;
}
