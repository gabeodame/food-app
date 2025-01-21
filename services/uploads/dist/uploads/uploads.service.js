"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
let UploadsService = class UploadsService {
    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }
    async uploadFileToS3(service, entityId, fileType, file) {
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        const fileKey = `${service}/${fileType}/${entityId}/${file.originalname}`;
        console.log('Uploading file:', fileKey);
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ServerSideEncryption: 'AES256',
        };
        try {
            const uploadResult = await this.s3.upload(params).promise();
            return {
                fileUrl: uploadResult.Location,
            };
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Error uploading file');
        }
    }
    async deleteFileFromS3(service, entityId, fileType, fileName) {
        const fileKey = `${service}/${fileType}/${entityId}/${fileName}`;
        console.log('Deleting file:', fileKey);
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey,
        };
        try {
            await this.s3.deleteObject(params).promise();
            console.log('File deleted successfully');
        }
        catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('Error deleting file');
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map