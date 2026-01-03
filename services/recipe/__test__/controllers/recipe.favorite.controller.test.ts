import "reflect-metadata"; // ✅ Ensure metadata support
import { prisma } from "../../src/lib/prisma";
import recipeFavoriteController from "../../src/controllers/recipe.favorite.controller";

jest.mock("../../src/lib/prisma", () => require("../../__mock__/prisma"));

describe("Recipe Favorite Controller", () => {
  let mockUserId: string;
  let mockRecipeId: number;

  beforeAll(() => {
    mockUserId = "test-user-id";
    mockRecipeId = 1;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRes = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    return res;
  };

  it("should successfully favorite a recipe", async () => {
    (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.favorite.create as jest.Mock).mockResolvedValue({
      userId: mockUserId,
      recipeId: mockRecipeId,
    });
    (prisma.recipe.update as jest.Mock).mockResolvedValue({});

    const req: any = {
      params: { id: String(mockRecipeId) },
      currentUser: { id: mockUserId },
    };
    const res = createRes();

    await recipeFavoriteController.favoriteRecipe(req, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Recipe favorited successfully",
      isFavoritedByCurrentUser: true,
    });
  });

  it("should successfully unfavorite a recipe", async () => {
    (prisma.favorite.findFirst as jest.Mock).mockResolvedValue({
      id: 10,
      userId: mockUserId,
      recipeId: mockRecipeId,
    });
    (prisma.favorite.delete as jest.Mock).mockResolvedValue({});
    (prisma.recipe.update as jest.Mock).mockResolvedValue({});

    const req: any = {
      params: { id: String(mockRecipeId) },
      currentUser: { id: mockUserId },
    };
    const res = createRes();

    await recipeFavoriteController.unfavoriteRecipe(req, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Recipe unfavorited successfully",
      isFavoritedByCurrentUser: false,
    });
  });
});
