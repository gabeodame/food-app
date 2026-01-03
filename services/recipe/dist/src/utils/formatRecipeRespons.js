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
exports.formatRecipeResponse = void 0;
const prisma_1 = require("./prisma");
const formatRecipeResponse = (recipe, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    if (!recipe) {
        throw new Error("Recipe data is undefined");
    }
    // Fetch view count from RecipeView table
    const viewCount = yield prisma_1.prisma.recipeView.count({
        where: { recipeId: recipe.id },
    });
    // Check if the current user has favorited the recipe
    const isFavoritedByCurrentUser = (_b = (_a = recipe === null || recipe === void 0 ? void 0 : recipe.favoritedBy) === null || _a === void 0 ? void 0 : _a.some((fav) => (fav === null || fav === void 0 ? void 0 : fav.userId) === currentUserId)) !== null && _b !== void 0 ? _b : false;
    return {
        id: (_c = recipe === null || recipe === void 0 ? void 0 : recipe.id) !== null && _c !== void 0 ? _c : null,
        title: (_d = recipe === null || recipe === void 0 ? void 0 : recipe.title) !== null && _d !== void 0 ? _d : "",
        slug: (_e = recipe === null || recipe === void 0 ? void 0 : recipe.slug) !== null && _e !== void 0 ? _e : "",
        imageUrl: (_f = recipe === null || recipe === void 0 ? void 0 : recipe.imageUrl) !== null && _f !== void 0 ? _f : "",
        description: (_g = recipe === null || recipe === void 0 ? void 0 : recipe.description) !== null && _g !== void 0 ? _g : "",
        userId: (_h = recipe === null || recipe === void 0 ? void 0 : recipe.userId) !== null && _h !== void 0 ? _h : null,
        favoritesCount: (_k = (_j = recipe === null || recipe === void 0 ? void 0 : recipe.favoritedBy) === null || _j === void 0 ? void 0 : _j.length) !== null && _k !== void 0 ? _k : 0,
        isFavoritedByCurrentUser,
        views: viewCount,
        // ✅ Ensure `ingredients` exist and have required properties
        ingredients: (_m = (_l = recipe === null || recipe === void 0 ? void 0 : recipe.ingredients) === null || _l === void 0 ? void 0 : _l.map((ri) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return ({
                id: (_b = (_a = ri === null || ri === void 0 ? void 0 : ri.ingredient) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                name: (_d = (_c = ri === null || ri === void 0 ? void 0 : ri.ingredient) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
                category: (_f = (_e = ri === null || ri === void 0 ? void 0 : ri.ingredient) === null || _e === void 0 ? void 0 : _e.category) !== null && _f !== void 0 ? _f : "",
                unit: (_g = ri === null || ri === void 0 ? void 0 : ri.unit) !== null && _g !== void 0 ? _g : "",
                quantity: (_h = ri === null || ri === void 0 ? void 0 : ri.quantity) !== null && _h !== void 0 ? _h : 0,
                recipeId: (_j = recipe === null || recipe === void 0 ? void 0 : recipe.id) !== null && _j !== void 0 ? _j : null,
            });
        })) !== null && _m !== void 0 ? _m : [],
        // ✅ Ensure `instructions` exist and are properly structured
        instructions: (_p = (_o = recipe === null || recipe === void 0 ? void 0 : recipe.instructions) === null || _o === void 0 ? void 0 : _o.map((instruction) => {
            var _a, _b, _c;
            return ({
                id: (_b = (_a = instruction === null || instruction === void 0 ? void 0 : instruction.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "", // Convert to string to avoid INT4 errors
                step: (_c = instruction === null || instruction === void 0 ? void 0 : instruction.step) !== null && _c !== void 0 ? _c : "",
            });
        })) !== null && _p !== void 0 ? _p : [],
        // ✅ Ensure `categories` are properly structured
        categories: (_r = (_q = recipe === null || recipe === void 0 ? void 0 : recipe.categories) === null || _q === void 0 ? void 0 : _q.map((cat) => {
            var _a, _b, _c, _d;
            return ({
                id: (_b = (_a = cat === null || cat === void 0 ? void 0 : cat.category) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                name: (_d = (_c = cat === null || cat === void 0 ? void 0 : cat.category) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
            });
        })) !== null && _r !== void 0 ? _r : [],
        // ✅ Ensure `tags` are correctly extracted
        tags: (_t = (_s = recipe === null || recipe === void 0 ? void 0 : recipe.tags) === null || _s === void 0 ? void 0 : _s.map((tag) => {
            var _a, _b, _c, _d;
            return ({
                id: (_b = (_a = tag === null || tag === void 0 ? void 0 : tag.tag) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                name: (_d = (_c = tag === null || tag === void 0 ? void 0 : tag.tag) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
            });
        })) !== null && _t !== void 0 ? _t : [],
        // ✅ Ensure `seasons` are correctly extracted
        seasons: (_v = (_u = recipe === null || recipe === void 0 ? void 0 : recipe.seasons) === null || _u === void 0 ? void 0 : _u.map((season) => {
            var _a, _b, _c, _d;
            return ({
                id: (_b = (_a = season === null || season === void 0 ? void 0 : season.season) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                name: (_d = (_c = season === null || season === void 0 ? void 0 : season.season) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
            });
        })) !== null && _v !== void 0 ? _v : [],
        // ✅ Ensure `cuisineTypes` are correctly extracted
        cuisineTypes: (_x = (_w = recipe === null || recipe === void 0 ? void 0 : recipe.cuisineTypes) === null || _w === void 0 ? void 0 : _w.map((cuisine) => {
            var _a, _b, _c, _d;
            return ({
                id: (_b = (_a = cuisine === null || cuisine === void 0 ? void 0 : cuisine.cuisineType) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                name: (_d = (_c = cuisine === null || cuisine === void 0 ? void 0 : cuisine.cuisineType) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
            });
        })) !== null && _x !== void 0 ? _x : [],
        // ✅ Ensure `specialDiets` are correctly extracted
        specialDiets: (_z = (_y = recipe === null || recipe === void 0 ? void 0 : recipe.specialDiets) === null || _y === void 0 ? void 0 : _y.map((diet) => {
            var _a, _b, _c, _d;
            return ({
                id: (_b = (_a = diet === null || diet === void 0 ? void 0 : diet.specialDiet) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                name: (_d = (_c = diet === null || diet === void 0 ? void 0 : diet.specialDiet) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
            });
        })) !== null && _z !== void 0 ? _z : [],
        createdAt: (_0 = recipe === null || recipe === void 0 ? void 0 : recipe.createdAt) !== null && _0 !== void 0 ? _0 : null,
        updatedAt: (_1 = recipe === null || recipe === void 0 ? void 0 : recipe.updatedAt) !== null && _1 !== void 0 ? _1 : null,
    };
});
exports.formatRecipeResponse = formatRecipeResponse;
