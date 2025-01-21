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
exports.IngredientService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ingredient_entity_1 = require("../lib/ingredient.entity");
const rabbitmq_broker_1 = require("@anchordiv/rabbitmq-broker");
const common_2 = require("@gogittix/common");
let IngredientService = class IngredientService {
    constructor(ingredientRepo) {
        this.ingredientRepo = ingredientRepo;
        this.rabbitMQUrl = process.env.RABBITMQ_URL;
    }
    async getAllIngredients() {
        return this.ingredientRepo.find();
    }
    async getIngredientById(id) {
        return this.ingredientRepo.findOne({ where: { id } });
    }
    async createIngredient(data, req) {
        console.log('Create ingredient req:', req);
        const ingredientData = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: req.currentUser.id,
        };
        try {
            const isExistingIngredient = await this.ingredientRepo.findOne({
                where: { name: ingredientData.name },
            });
            if (isExistingIngredient) {
                throw new Error('Ingredient already exists');
            }
            const ingredient = this.ingredientRepo.create(ingredientData);
            const savedIngredient = await this.ingredientRepo.save(ingredient);
            console.log('Saved ingredient:', savedIngredient);
            await this.handlePublishOrUpdateIngredient('create', savedIngredient);
            return savedIngredient;
        }
        catch (error) {
            console.log('Error creating ingredient:', error.message);
            throw new Error(`Error creating ingredient: ${error.message}`);
        }
    }
    async updateIngredient(id, data, req) {
        try {
            const ingredient = await this.ingredientRepo.findOne({ where: { id } });
            if (!ingredient) {
                throw new Error('Ingredient not found');
            }
            if (ingredient.createdBy !== req.currentUser.id) {
                throw new Error('Not authorized to update ingredient');
            }
            await this.ingredientRepo.update({ id }, data);
            await this.handlePublishOrUpdateIngredient('update', data);
            return this.getIngredientById(id);
        }
        catch (error) {
            throw new Error(`Error updating ingredient: ${error.message}`);
        }
    }
    async deleteIngredient(id, req) {
        try {
            const ingredient = await this.ingredientRepo.findOne({ where: { id } });
            if (!ingredient) {
                throw new Error('Ingredient not found');
            }
            if (ingredient.createdBy !== req.currentUser.id) {
                throw new common_2.NotAuthorizedError();
            }
            const isAttachedToRecipe = await this.isIngredientAttachedToRecipe(id);
            if (isAttachedToRecipe) {
                throw new common_2.BadRequestError('Ingredient is attached to a recipe');
            }
            await this.ingredientRepo.delete({ id });
        }
        catch (error) {
            throw new common_2.BadRequestError(`Error deleting ingredient: ${error.message}`);
        }
    }
    async isIngredientAttachedToRecipe(id) {
        const baseUrl = 'http://recipe-service.recipe.svc.cluster.local:3000';
        console.log('Checking ingredient attachment to recipe');
        const url = `${baseUrl}/api/1/recipes/search?ingredientId=1
=${id}`;
        console.log('URL:', url);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.SERVICE_API_KEY}`,
                },
            });
            console.log('Response:', response.status);
            if (!response.ok) {
                if (response.status === 404) {
                    return false;
                }
                throw new common_2.BadRequestError(`Error checking ingredient attachment ${response.statusText}`);
            }
            return true;
        }
        catch (error) {
            console.error('Error checking ingredient attachment to recipe:', error.message);
            throw new Error('Unable to verify ingredient attachment');
        }
    }
    async handlePublishOrUpdateIngredient(action = 'create', data, exchange = 'recipe.ingredients.inventory-updates', routingKey = 'ingredients.create.ingredient', type = 'topic') {
        const broker = rabbitmq_broker_1.RabbitMQBroker.getInstance();
        await broker.init(this.rabbitMQUrl);
        const message = JSON.stringify(data);
        if (action) {
            routingKey = `recipe.ingredients.${action}.ingredient`;
        }
        await broker.publishToExchange(exchange, routingKey, message, {
            type,
            persitence: true,
        });
    }
};
exports.IngredientService = IngredientService;
exports.IngredientService = IngredientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ingredient_entity_1.Ingredient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IngredientService);
//# sourceMappingURL=ingredient.service.js.map