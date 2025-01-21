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
exports.IngredientCreatedEvent = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class IngredientCreatedEvent {
}
exports.IngredientCreatedEvent = IngredientCreatedEvent;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'The unique ID of the ingredient',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IngredientCreatedEvent.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tomato', description: 'The name of the ingredient' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IngredientCreatedEvent.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Vegetables',
        description: 'The category of the ingredient',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IngredientCreatedEvent.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'grams',
        description: 'The unit of measurement for the ingredient',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IngredientCreatedEvent.prototype, "unit", void 0);
//# sourceMappingURL=ingredient-created.dto.js.map