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
const recipe_service_1 = __importDefault(require("./recipe.service"));
const prisma_1 = require("../utils/prisma");
const common_1 = require("@gogittix/common");
class RecipeFavoriteService {
    constructor() {
        this.recipeService = recipe_service_1.default;
    }
    getFavoriteStatus(userId, recipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const favorite = yield prisma_1.prisma.favorite.findFirst({
                    where: { userId, recipeId },
                });
                return !!favorite; // Convert to boolean
            }
            catch (error) {
                console.error("Error fetching favorite status:", error);
                throw new common_1.BadRequestError("Error fetching favorite status");
            }
        });
    }
    favoriteRecipe(userId, recipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingFavorite = yield prisma_1.prisma.favorite.findFirst({
                    where: { userId, recipeId },
                });
                if (!existingFavorite) {
                    yield prisma_1.prisma.favorite.create({
                        data: { userId, recipeId },
                    });
                    yield prisma_1.prisma.recipe.update({
                        where: { id: recipeId },
                        data: { favoritesCount: { increment: 1 } },
                    });
                }
                return true;
            }
            catch (error) {
                console.error("Error favoriting recipe:", error);
                throw new common_1.BadRequestError("Error favoriting recipe");
            }
        });
    }
    unfavoriteRecipe(userId, recipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingFavorite = yield prisma_1.prisma.favorite.findFirst({
                    where: { userId, recipeId },
                });
                if (!existingFavorite) {
                    throw new common_1.BadRequestError("Recipe is not favorited.");
                }
                yield prisma_1.prisma.favorite.delete({
                    where: { id: existingFavorite.id },
                });
                yield prisma_1.prisma.recipe.update({
                    where: { id: recipeId },
                    data: { favoritesCount: { decrement: 1 } },
                });
                return false; // Ensure consistent return type
            }
            catch (error) {
                console.error("Error unfavoriting recipe:", error);
                throw new common_1.BadRequestError("Error unfavoriting recipe");
            }
        });
    }
}
const recipeFavoriteService = new RecipeFavoriteService();
exports.default = recipeFavoriteService;
