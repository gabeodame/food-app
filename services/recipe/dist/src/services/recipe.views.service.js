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
const prisma_1 = require("../utils/prisma");
class RecipeViewsService {
    constructor() { }
    incrementRecipeView(recipeId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //   Avoid duplicate views from the same user in a short time
                const recentView = yield prisma_1.prisma.recipeView.findFirst({
                    where: {
                        recipeId,
                        userId: userId || null,
                        viewedAt: {
                            gte: new Date(Date.now() - 1000 * 60 * 60), // Avoid duplicate views within 1 hour
                        },
                    },
                });
                if (!recentView) {
                    yield prisma_1.prisma.recipeView.create({
                        data: {
                            recipeId,
                            userId: userId || null,
                        },
                    });
                }
            }
            catch (error) {
                console.error("Error updating recipe view:", error);
            }
        });
    }
    getRecipeViews(recipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.recipeView.count({
                where: { recipeId },
            });
        });
    }
}
const recipeViewsService = new RecipeViewsService();
exports.default = recipeViewsService;
