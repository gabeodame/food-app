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
require("reflect-metadata"); // ✅ Ensure metadata support
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const prisma_1 = require("../../__mock__/prisma");
jest.mock("../../utils/prisma", () => require("../../__mocks__/prisma"));
describe("Recipe Favorite Controller", () => {
    let mockUserId;
    let mockRecipeId;
    beforeAll(() => {
        mockUserId = "test-user-id";
        mockRecipeId = 1;
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should successfully favorite a recipe", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.favorite.findFirst.mockResolvedValue(null); // ✅ Fix: Mock method correctly
        prisma_1.prisma.favorite.create.mockResolvedValue({
            userId: mockUserId,
            recipeId: mockRecipeId,
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/favorite/${mockRecipeId}`)
            .set("Authorization", `Bearer mock-token`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Recipe favorited successfully");
    }));
    it("should successfully unfavorite a recipe", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.favorite.findFirst.mockResolvedValue({
            userId: mockUserId,
            recipeId: mockRecipeId,
        });
        prisma_1.prisma.favorite.delete.mockResolvedValue({});
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/favorite/${mockRecipeId}`)
            .set("Authorization", `Bearer mock-token`)
            .send();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Recipe unfavorited successfully");
    }));
});
