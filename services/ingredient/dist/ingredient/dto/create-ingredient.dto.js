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
exports.CreateIngredientDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateIngredientDto {
}
exports.CreateIngredientDto = CreateIngredientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the ingredient',
        example: 'Tomato',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIngredientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The category of the ingredient',
        example: 'Vegetables',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIngredientDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unit of measurement for the ingredient',
        example: 'grams',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIngredientDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The number of calories in the ingredient',
        example: 22,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "calories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The amount of protein in the ingredient',
        example: 1.2,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "protein", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The amount of fat in the ingredient',
        example: 0.2,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "fat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The amount of carbohydrates in the ingredient',
        example: 3.5,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIngredientDto.prototype, "carbohydrates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The amount of fiber in the ingredient',
        example: 1.2,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIngredientDto.prototype, "allergens", void 0);
//# sourceMappingURL=create-ingredient.dto.js.map