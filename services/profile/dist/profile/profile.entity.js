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
exports.Profile = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Profile = class Profile {
};
exports.Profile = Profile;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1',
        description: 'The ID of the user',
    }),
    (0, typeorm_1.Column)({ primary: true }),
    __metadata("design:type", String)
], Profile.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'johndoe',
        description: 'The username of the user',
    }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Profile.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'example@example.com',
        description: 'The email of the user',
        required: true,
    }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Profile.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John',
        description: 'The first name of the user',
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Doe',
        description: 'The last name of the user',
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'I am a software engineer.',
        description: 'The biography of the user',
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/profile.jpg',
        description: 'The URL of the profile image',
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "imageUrl", void 0);
exports.Profile = Profile = __decorate([
    (0, typeorm_1.Entity)('profiles')
], Profile);
//# sourceMappingURL=profile.entity.js.map