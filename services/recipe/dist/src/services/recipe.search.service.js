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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@gogittix/common");
const prisma_1 = require("../utils/prisma");
const axios_1 = __importDefault(require("axios"));
class RecipeSearchService {
    searchBySlug(query, req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const filters = {};
                console.log("Incoming Query Parameters:", query);
                const hasValidFilters = Object.keys(query).some((key) => [
                    "ingredientName",
                    "ingredientId",
                    "category",
                    "slug",
                    "currentUserId",
                ].includes(key));
                if (!hasValidFilters) {
                    throw new common_1.BadRequestError("Invalid search query. No valid filters provided.");
                }
                if (query.currentUserId) {
                    if (!((_a = req === null || req === void 0 ? void 0 : req.currentUser) === null || _a === void 0 ? void 0 : _a.id)) {
                        throw new common_1.BadRequestError(`Authentication required for user-based filtering. req.currentUser.id ${req.currentUser.id}`);
                    }
                    filters.userId = req.currentUser.id;
                }
                if (query.ingredientName) {
                    filters.ingredients = {
                        some: {
                            ingredient: {
                                name: {
                                    contains: query.ingredientName,
                                    mode: "insensitive",
                                },
                            },
                        },
                    };
                }
                if (query.ingredientId) {
                    filters.ingredients = {
                        some: { ingredientId: parseInt(query.ingredientId, 10) },
                    };
                }
                if (query.category) {
                    filters.categories = {
                        some: {
                            category: {
                                name: { contains: query.category, mode: "insensitive" },
                            },
                        },
                    };
                }
                if (query.slug) {
                    filters.slug = { contains: query.slug, mode: "insensitive" };
                }
                console.log("Generated Prisma Filters:", JSON.stringify(filters, null, 2));
                const recipes = yield prisma_1.prisma.recipe.findMany({
                    where: filters,
                    include: {
                        ingredients: { include: { ingredient: true } },
                        categories: { include: { category: true } },
                    },
                    take: 20,
                });
                console.log(`Fetched ${recipes.length} recipes`);
                return recipes;
            }
            catch (error) {
                console.error("Error searching recipes:", error);
                if (error.code === "P2025") {
                    throw new common_1.BadRequestError("No matching recipes found.");
                }
                throw new common_1.BadRequestError(`Search failed: ${error.message}`);
            }
        });
    }
    getRecipesWithIngredient(ingredientId, ingredientName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ingredientId && !ingredientName) {
                throw new common_1.BadRequestError("Ingredient ID or Name is required.");
            }
            // ✅ Step 1: Fetch recipes that use this ingredient
            const recipes = yield prisma_1.prisma.recipe.findMany({
                where: {
                    ingredients: {
                        some: {
                            ingredientId: ingredientId,
                            ingredient: ingredientName
                                ? { name: { contains: ingredientName, mode: "insensitive" } }
                                : undefined,
                        },
                    },
                },
                include: {
                    ingredients: {
                        include: { ingredient: true }, // Fetch ingredient details
                    },
                },
                take: 20,
            });
            if (recipes.length === 0) {
                return [];
            }
            // ✅ Step 2: Extract unique ingredient IDs for lookup
            const uniqueIngredientIds = [
                ...new Set(recipes.flatMap((recipe) => recipe.ingredients.map((ri) => ri.ingredientId))),
            ];
            // ✅ Step 3: Fetch nutritional info from Ingredient Service
            try {
                const ingredientDetails = yield axios_1.default.get(`http://ingredient-service.api.svc.cluster.local/api/1/ingredient/batch`, { params: { ids: uniqueIngredientIds.join(",") } });
                const ingredientDataMap = ingredientDetails.data.reduce((acc, ingredient) => {
                    acc[ingredient.id] = ingredient;
                    return acc;
                }, {});
                // ✅ Step 4: Enrich recipes with ingredient details
                return recipes.map((recipe) => ({
                    id: recipe.id,
                    title: recipe.title,
                    description: recipe.description,
                    imageUrl: recipe.imageUrl,
                    nutritionalBreakdown: this.calculateNutrition(recipe.ingredients, ingredientDataMap),
                }));
            }
            catch (error) {
                console.error("Failed to fetch ingredient details:", error);
                throw new common_1.BadRequestError("Could not retrieve ingredient data.");
            }
        });
    }
    // ✅ Compute Nutrition Per Recipe
    calculateNutrition(recipeIngredients, ingredientDataMap) {
        return recipeIngredients.reduce((acc, ri) => {
            const ingredient = ingredientDataMap[ri.ingredientId];
            if (!ingredient)
                return acc; // Skip if ingredient data is missing
            acc.calories += (ingredient.calories || 0) * (ri.quantity || 1);
            acc.protein += (ingredient.protein || 0) * (ri.quantity || 1);
            acc.fat += (ingredient.fat || 0) * (ri.quantity || 1);
            acc.carbohydrates +=
                (ingredient.carbohydrates || 0) * (ri.quantity || 1);
            if (ingredient.allergens) {
                acc.allergens.add(...ingredient.allergens.split(",").map((a) => a.trim()));
            }
            return acc;
        }, {
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0,
            allergens: new Set(),
        });
    }
}
exports.default = new RecipeSearchService();
