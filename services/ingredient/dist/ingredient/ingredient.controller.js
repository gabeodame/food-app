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
exports.IngredientController = void 0;
const common_1 = require("@nestjs/common");
const ingredient_service_1 = require("./ingredient.service");
const dto_1 = require("./dto");
const ingredient_entity_1 = require("../lib/ingredient.entity");
const swagger_1 = require("@nestjs/swagger");
const ingredient_search_service_1 = require("./ingredient-search.service");
let IngredientController = class IngredientController {
    constructor(ingredientService, searchService) {
        this.ingredientService = ingredientService;
        this.searchService = searchService;
    }
    async createIngredient(req, data) {
        return this.ingredientService.createIngredient(data, req);
    }
    async getAllIngredients() {
        try {
            return this.ingredientService.getAllIngredients();
        }
        catch (error) {
            console.log('[Ingredeint Get Route]: ', error.message);
            return error;
        }
    }
    async getIngredientById(id) {
        return this.ingredientService.getIngredientById(id);
    }
    async updateIngredient(id, data, req) {
        return this.ingredientService.updateIngredient(id, data, req);
    }
    async deleteIngredient(id, req) {
        return this.ingredientService.deleteIngredient(id, req);
    }
};
exports.IngredientController = IngredientController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new ingredient' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The ingredient has been successfully created.',
        type: ingredient_entity_1.Ingredient,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateIngredientDto]),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "createIngredient", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ingredients' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return all ingredients.',
        type: [ingredient_entity_1.Ingredient],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "getAllIngredients", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an ingredient by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return an ingredient by ID.',
        type: ingredient_entity_1.Ingredient,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "getIngredientById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an ingredient by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return the updated ingredient.',
        type: ingredient_entity_1.Ingredient,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    (0, swagger_1.ApiBody)({
        description: 'Partial update of an ingredient',
        examples: {
            example1: {
                summary: 'Update name and category',
                value: {
                    name: 'Carrot',
                    category: 'Vegetable',
                },
            },
            example2: {
                summary: 'Update nutrition info',
                value: {
                    calories: 30,
                    protein: 1.5,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateIngredientDto, Object]),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "updateIngredient", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an ingredient by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The ingredient has been successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Something went wrong' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], IngredientController.prototype, "deleteIngredient", null);
exports.IngredientController = IngredientController = __decorate([
    (0, swagger_1.ApiTags)('ingredient'),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, common_1.Controller)('api/1/ingredient'),
    __metadata("design:paramtypes", [ingredient_service_1.IngredientService,
        ingredient_search_service_1.IngredientSearchService])
], IngredientController);
//# sourceMappingURL=ingredient.controller.js.map