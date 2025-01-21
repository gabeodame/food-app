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
exports.Ingredient = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Ingredient = class Ingredient {
};
exports.Ingredient = Ingredient;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'The unique ID of the ingredient',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ingredient.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tomato', description: 'The name of the ingredient' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Ingredient.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Vegetables',
        description: 'The category of the ingredient',
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ingredient.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'grams',
        description: 'The unit of measurement for the ingredient',
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ingredient.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/image.jpg',
        description: 'URL to an image of the ingredient',
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ingredient.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 20.5,
        description: 'Calories per unit of the ingredient',
    }),
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], Ingredient.prototype, "calories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1.5,
        description: 'Protein per unit of the ingredient',
    }),
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], Ingredient.prototype, "protein", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.2, description: 'Fat per unit of the ingredient' }),
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], Ingredient.prototype, "fat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 4.0,
        description: 'Carbohydrates per unit of the ingredient',
    }),
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], Ingredient.prototype, "carbohydrates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'nuts, gluten',
        description: 'Allergens present in the ingredient',
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ingredient.prototype, "allergens", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: new Date() }),
    __metadata("design:type", Date)
], Ingredient.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: new Date() }),
    __metadata("design:type", Date)
], Ingredient.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ingredient.prototype, "createdBy", void 0);
exports.Ingredient = Ingredient = __decorate([
    (0, typeorm_1.Entity)()
], Ingredient);
//# sourceMappingURL=ingredient.entity.js.map