"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@gogittix/common");
const prisma_1 = require("../utils/prisma");
class RecipeIngredientService {
    searchIngredients(term) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Searching ingredients in Recipe Service:", term);
                const ingredients = yield prisma_1.prisma.ingredient.findMany({
                    where: {
                        name: {
                            contains: term,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        name: "asc",
                    },
                    take: 20, // ✅ Limit to avoid performance issues
                });
                return ingredients;
            }
            catch (error) {
                console.error("Error searching ingredients:", error);
                throw new common_1.BadRequestError(`Search failed: ${error.message}`);
            }
        });
    }
    cacheIngredient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, category, unit, recipeIds } = data;
            console.log("Caching ingredient:", data);
            try {
                // Ensure the ingredient is created or updated
                const createOrUpdate = yield prisma_1.prisma.ingredient.upsert({
                    where: { id },
                    update: {
                        name,
                        category,
                        // unit,
                    },
                    create: {
                        id,
                        name,
                        category,
                        // unit,
                    },
                });
                return createOrUpdate;
            }
            catch (error) {
                console.error("Error caching ingredient:", error);
                throw new common_1.BadRequestError(`Error caching ingredient: ${error.message}`);
            }
        });
    }
    handleDeadLetter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to handle dead-lettered messages
            console.log("Handling dead-lettered ingredient message:", data);
            // Implement appropriate actions for dead-lettered messages
            yield this.cacheIngredient(data);
        });
    }
}
exports.default = new RecipeIngredientService();
