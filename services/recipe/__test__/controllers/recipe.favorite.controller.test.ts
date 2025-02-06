import "reflect-metadata"; // ✅ Ensure metadata support
import request from "supertest";
import { NotAuthorizedError, BadRequestError } from "@gogittix/common";
import app from "../../src/app";
import { prisma } from "../../__mock__/prisma";

jest.mock("../../utils/prisma", () => require("../../__mocks__/prisma"));

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

  it("should successfully favorite a recipe", async () => {
    prisma.favorite.findFirst.mockResolvedValue(null); // ✅ Fix: Mock method correctly
    prisma.favorite.create.mockResolvedValue({
      userId: mockUserId,
      recipeId: mockRecipeId,
    });

    const response = await request(app)
      .post(`/favorite/${mockRecipeId}`)
      .set("Authorization", `Bearer mock-token`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Recipe favorited successfully");
  });

  it("should successfully unfavorite a recipe", async () => {
    prisma.favorite.findFirst.mockResolvedValue({
      userId: mockUserId,
      recipeId: mockRecipeId,
    });
    prisma.favorite.delete.mockResolvedValue({});

    const response = await request(app)
      .delete(`/favorite/${mockRecipeId}`)
      .set("Authorization", `Bearer mock-token`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Recipe unfavorited successfully");
  });
});
