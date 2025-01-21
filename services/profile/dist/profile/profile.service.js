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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profile_entity_1 = require("./profile.entity");
const rabbitmq_broker_1 = require("@anchordiv/rabbitmq-broker");
const aws_sdk_1 = require("aws-sdk");
let ProfileService = class ProfileService {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
    }
    async onApplicationBootstrap() {
        const broker = rabbitmq_broker_1.RabbitMQBroker.getInstance();
        await broker.init(process.env.RABBITMQ_URL);
        const exchange = 'recipe.users.profile-updates';
        const mainQueue = 'profile-user-signup-queue';
        const dlx = 'profile-users-dlx';
        const dlq = 'profile-user-signup-dlq';
        const routingKey = 'users.signup.new-user';
        await broker.setupDeadLetterQueue(mainQueue, dlx, dlq);
        await broker.consume(dlq, async (message) => {
            try {
                console.log('Dead-lettered message:', message.content.toString());
                await this.handleUserCreated(message.content);
            }
            catch (error) {
                console.error('Error handling dead-lettered message:', error);
            }
        });
        await broker.assertExchange(exchange, 'topic');
        await broker.bindQueue(mainQueue, exchange, routingKey);
        await broker.consume(mainQueue, async (message) => {
            await this.handleUserCreated(message.content);
        });
    }
    async handleUserCreated(message) {
        try {
            const data = JSON.parse(message.toString());
            console.log('Message received:', data);
            const profile = this.profileRepository.create(data);
            await this.profileRepository.save(profile);
        }
        catch (error) {
            console.error('Error handling user-created message:', error);
        }
    }
    async createProfile(data) {
        const profile = this.profileRepository.create(data);
        return this.profileRepository.save(profile);
    }
    async getProfileById(id) {
        const profile = await this.profileRepository.findOne({ where: { id } });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    async getProfileByEmail(email) {
        return this.profileRepository.findOne({ where: { email } });
    }
    async updateProfile(id, data) {
        const profile = await this.getProfileById(id);
        Object.assign(profile, data);
        return this.profileRepository.save(profile);
    }
    async deleteProfile(id) {
        const result = await this.profileRepository.delete(id);
        if (!result.affected) {
            throw new common_1.NotFoundException('Profile not found');
        }
    }
    async uploadProfileImageToS3(id, file) {
        const profile = await this.getProfileById(id);
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        const fileKey = `profile-images/${profile.id}/profile-picture`;
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
                imageUrl: uploadResult.Location,
            };
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Error uploading file');
        }
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProfileService);
//# sourceMappingURL=profile.service.js.map