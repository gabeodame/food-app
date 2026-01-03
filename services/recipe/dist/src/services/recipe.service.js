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
const prisma_1 = require("../utils/prisma");
const common_1 = require("@gogittix/common");
const slugify_1 = __importDefault(require("slugify"));
const formatRecipeRespons_1 = require("../utils/formatRecipeRespons");
class RecipeService {
    createRecipe(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(req === null || req === void 0 ? void 0 : req.currentUser))
                throw new common_1.NotAuthorizedError();
            console.log(req.body);
            const userId = req.currentUser.id;
            const { title, description, imageUrl, ingredients, instructions, categories, tags, cuisineTypes, seasonalEvent, specialDiets, } = req.body;
            const slug = (0, slugify_1.default)(title, { lower: true, strict: true });
            try {
                const newRecipe = yield prisma_1.prisma.recipe.create({
                    data: {
                        userId,
                        title,
                        slug,
                        description,
                        imageUrl,
                        ingredients: {
                            create: ingredients.map((ingredient) => ({
                                ingredient: { connect: { id: ingredient.id } },
                                quantity: ingredient.quantity,
                                unit: ingredient.unit || null,
                            })),
                        },
                        instructions: {
                            create: instructions.map((instruction) => ({
                                step: instruction.step,
                            })),
                        },
                        categories: {
                            create: categories === null || categories === void 0 ? void 0 : categories.map((category) => ({
                                category: {
                                    connectOrCreate: {
                                        where: { name: category.name },
                                        create: { name: category.name },
                                    },
                                },
                            })),
                        },
                        tags: {
                            create: tags === null || tags === void 0 ? void 0 : tags.map((tag) => ({
                                tag: {
                                    connectOrCreate: {
                                        where: { name: tag.name },
                                        create: { name: tag.name },
                                    },
                                },
                            })),
                        },
                        cuisineTypes: {
                            create: cuisineTypes === null || cuisineTypes === void 0 ? void 0 : cuisineTypes.map((cuisine) => ({
                                cuisineType: {
                                    connectOrCreate: {
                                        where: { name: cuisine.name }, // ✅ Now refers to CuisineType, which has a unique name
                                        create: { name: cuisine.name },
                                    },
                                },
                            })),
                        },
                        seasons: {
                            create: seasonalEvent === null || seasonalEvent === void 0 ? void 0 : seasonalEvent.map((season) => ({
                                season: {
                                    connectOrCreate: {
                                        where: { name: season.name },
                                        create: { name: season.name },
                                    },
                                },
                            })),
                        },
                        specialDiets: {
                            create: specialDiets === null || specialDiets === void 0 ? void 0 : specialDiets.map((diet) => ({
                                specialDiet: {
                                    connectOrCreate: {
                                        where: { name: diet.name },
                                        create: { name: diet.name },
                                    },
                                },
                            })),
                        },
                        createdAt: new Date(),
                    },
                });
                return newRecipe;
            }
            catch (error) {
                console.error("Error creating recipe:", error);
                return new common_1.BadRequestError(`Error creating recipe: ${error.message}`);
            }
        });
    }
    updateRecipe(req) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Update Request body:", req.body);
            const id = Number(req.params.id);
            if (!req.body)
                return new common_1.BadRequestError("Request body is required");
            const { title, description, imageUrl, ingredients, instructions, cuisineTypes, categories, seasonalEvent, specialDiets, tags, } = req.body;
            try {
                if (!req.currentUser)
                    throw new common_1.NotAuthorizedError();
                console.log("Current User ID:", req.currentUser.id);
                const userId = req.currentUser.id;
                const slug = (0, slugify_1.default)(title, { lower: true, strict: true });
                const recipe = yield prisma_1.prisma.recipe.findFirstOrThrow({
                    where: { id },
                    select: {
                        userId: true,
                    },
                });
                if (recipe.userId !== userId) {
                    throw new common_1.NotAuthorizedError();
                }
                const updatedRecipe = yield prisma_1.prisma.recipe.update({
                    where: { id },
                    data: {
                        title,
                        slug,
                        description,
                        imageUrl,
                        ingredients: {
                            deleteMany: {}, // ✅ Remove old ingredient associations
                            create: ingredients === null || ingredients === void 0 ? void 0 : ingredients.map((ingredient) => ({
                                ingredient: { connect: { id: ingredient.id } }, // Always reconnect
                                quantity: ingredient.quantity,
                                unit: ingredient.unit || null,
                            })),
                        },
                        instructions: {
                            deleteMany: {}, // Remove all existing instructions
                            create: instructions === null || instructions === void 0 ? void 0 : instructions.map((instruction) => ({
                                step: instruction.step, // Only insert steps, let the DB handle the IDs
                            })),
                        },
                        categories: {
                            deleteMany: {}, // ✅ Remove existing category links
                            create: categories === null || categories === void 0 ? void 0 : categories.map((category) => ({
                                category: {
                                    connectOrCreate: {
                                        where: { name: category.name }, // Only match by name
                                        create: { name: category.name },
                                    },
                                },
                            })),
                        },
                        tags: {
                            deleteMany: {}, // ✅ Remove existing tag links
                            create: tags === null || tags === void 0 ? void 0 : tags.map((tag) => ({
                                tag: {
                                    connectOrCreate: {
                                        where: { name: tag.name }, // Only match by name
                                        create: { name: tag.name },
                                    },
                                },
                            })),
                        },
                        cuisineTypes: {
                            deleteMany: {}, // ✅ Remove existing cuisine links
                            create: cuisineTypes === null || cuisineTypes === void 0 ? void 0 : cuisineTypes.map((cuisine) => ({
                                cuisineType: {
                                    connectOrCreate: {
                                        where: { name: cuisine.name }, // Only match by name
                                        create: { name: cuisine.name },
                                    },
                                },
                            })),
                        },
                        seasons: {
                            deleteMany: {}, // ✅ Remove existing season links
                            create: seasonalEvent === null || seasonalEvent === void 0 ? void 0 : seasonalEvent.map((season) => ({
                                season: {
                                    connectOrCreate: {
                                        where: { name: season.name }, // Only match by name
                                        create: { name: season.name },
                                    },
                                },
                            })),
                        },
                        specialDiets: {
                            deleteMany: {}, // ✅ Remove existing special diet links
                            create: specialDiets === null || specialDiets === void 0 ? void 0 : specialDiets.map((diet) => ({
                                specialDiet: {
                                    connectOrCreate: {
                                        where: { name: diet.name }, // Only match by name
                                        create: { name: diet.name },
                                    },
                                },
                            })),
                        },
                        updatedAt: new Date(),
                    },
                });
                return (0, formatRecipeRespons_1.formatRecipeResponse)(updatedRecipe, userId);
            }
            catch (error) {
                console.error("Error updating recipe:", error);
                return new common_1.BadRequestError(`Error updating recipe: ${error.message}`);
            }
        });
    }
    getAllRecipes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const currentUserId = ((_a = req === null || req === void 0 ? void 0 : req.currentUser) === null || _a === void 0 ? void 0 : _a.id) || "0";
                console.log("Current User ID from recipe service:", currentUserId);
                const recipes = yield prisma_1.prisma.recipe.findMany({
                    include: {
                        favoritedBy: { select: { userId: true } },
                        views: true,
                    },
                });
                return recipes.map((recipe) => ({
                    id: recipe.id,
                    title: recipe.title,
                    slug: recipe.slug,
                    imageUrl: recipe.imageUrl,
                    description: recipe.description,
                    userId: recipe.userId,
                    views: recipe.views.length,
                    favoritesCount: recipe.favoritedBy.length,
                    isFavoritedByCurrentUser: recipe.favoritedBy.some((fav) => fav.userId === currentUserId),
                    createdAt: recipe.createdAt,
                    updatedAt: recipe.updatedAt,
                }));
            }
            catch (error) {
                return new common_1.BadRequestError(`Error fetching recipes: ${error.message}`);
            }
        });
    }
    getRecipeById(id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let currentUserId = ((_a = req === null || req === void 0 ? void 0 : req.currentUser) === null || _a === void 0 ? void 0 : _a.id) || "0";
            try {
                const recipe = yield prisma_1.prisma.recipe.findFirstOrThrow({
                    where: { id },
                    include: {
                        instructions: true,
                        views: true,
                        ingredients: { include: { ingredient: true } },
                        favoritedBy: { select: { userId: true } },
                        categories: { include: { category: true } },
                        tags: { include: { tag: true } },
                        cuisineTypes: { include: { cuisineType: true } },
                        seasons: { include: { season: true } },
                        specialDiets: { include: { specialDiet: true } },
                    },
                });
                return (0, formatRecipeRespons_1.formatRecipeResponse)(recipe, currentUserId);
            }
            catch (error) {
                console.error("Error fetching recipe:", error);
                return new common_1.BadRequestError(`Error fetching recipe: ${error.message}`);
            }
        });
    }
    deleteRecipe(id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.currentUser)
                throw new common_1.NotAuthorizedError();
            try {
                const userId = req.currentUser.id;
                const foundRecipe = yield prisma_1.prisma.recipe.findFirstOrThrow({
                    where: { id },
                    select: {
                        userId: true,
                    },
                });
                if (!foundRecipe) {
                    throw new common_1.NotFoundError();
                }
                if (foundRecipe.userId !== userId) {
                    throw new common_1.NotAuthorizedError();
                }
                const recipe = yield prisma_1.prisma.recipe.delete({
                    where: { id },
                });
                return {
                    message: "Recipe deleted successfully",
                    data: recipe,
                };
            }
            catch (error) {
                console.error("Error deleting recipe:", error);
                return new common_1.BadRequestError(`Error deleting recipe: ${error.message}`);
            }
        });
    }
}
exports.default = new RecipeService();
