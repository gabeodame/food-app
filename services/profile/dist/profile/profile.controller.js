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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const profile_service_1 = require("./profile.service");
const dto_1 = require("./dto");
const profile_entity_1 = require("./profile.entity");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async createProfile(profileDto) {
        try {
            return await this.profileService.createProfile(profileDto);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.HttpException(`A profile with the provided username or email already exists.`, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProfileById(id) {
        try {
            const userId = id;
            return await this.profileService.getProfileById(userId);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProfileByEmail(email) {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) {
            throw new common_1.HttpException('Invalid email address', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.profileService.getProfileByEmail(email);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProfile(id, profileDto) {
        try {
            return await this.profileService.updateProfile(id, profileDto);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.HttpException(`A profile with the provided username or email already exists.`, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteProfile(id) {
        try {
            await this.profileService.deleteProfile(id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadProfileImage(id, file) {
        try {
            return await this.profileService.uploadProfileImageToS3(id, file);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new profile' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The profile has been successfully created.',
        type: profile_entity_1.Profile,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateProfileDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a profile by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return a profile by ID.',
        type: profile_entity_1.Profile,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfileById", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a profile by email' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return a profile by email.',
        type: profile_entity_1.Profile,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfileByEmail", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a profile by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return the updated profile.',
        type: profile_entity_1.Profile,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    (0, swagger_1.ApiBody)({
        description: 'Partial update of a profile',
        examples: {
            example1: {
                summary: 'Update firstName and lastName',
                value: {
                    firstName: 'John',
                    lastName: 'Foe',
                },
            },
            example2: {
                summary: 'Update bio',
                value: {
                    bio: 'A software engineer with a passion for cooking.',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a profile by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'The profile has been successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "deleteProfile", null);
__decorate([
    (0, common_1.Post)(':id/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'The ID of the entity to associate with the uploaded file',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({
        description: 'File to upload',
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'File successfully uploaded',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid file upload request',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "uploadProfileImage", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('profile'),
    (0, common_1.Controller)('api/1/profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map