import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import {
  users,
  categories,
  tagData,
  cuisineTypes,
  seasonal,
  specialDiets,
  recipes,
} from "../src/data/foodData";

const prisma = new PrismaClient();

const parseQuantity = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return null;
  const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? null : numeric;
};

const ensureSeedAllowed = () => {
  if (process.env.SEED_ALLOW !== "true") {
    console.log("Seeding disabled: set SEED_ALLOW=true to proceed.");
    return false;
  }
  return true;
};

const upsertUsers = async () => {
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        username: user.name ?? null,
      },
      create: {
        id: user.id,
        email: user.email,
        username: user.name ?? null,
      },
    });
  }
};

const upsertLookups = async () => {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }

  for (const tag of tagData) {
    const name = tag.trim();
    if (!name) continue;
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const cuisine of cuisineTypes) {
    await prisma.cuisineType.upsert({
      where: { name: cuisine.name },
      update: {},
      create: { name: cuisine.name },
    });
  }

  for (const season of seasonal) {
    await prisma.season.upsert({
      where: { name: season.name },
      update: {},
      create: { name: season.name },
    });
  }

  for (const diet of specialDiets) {
    await prisma.specialDiet.upsert({
      where: { name: diet.name },
      update: {},
      create: { name: diet.name },
    });
  }
};

const upsertIngredients = async () => {
  const ingredientNames = Array.from(
    new Set(
      recipes.flatMap((recipe) =>
        recipe.ingredients.map((ingredient) => ingredient.name.trim())
      )
    )
  ).filter(Boolean);

  const ingredientMap = new Map<string, number>();
  const idBase = 1000;

  for (const [index, name] of ingredientNames.entries()) {
    const existing = await prisma.ingredient.findFirst({ where: { name } });
    if (existing) {
      ingredientMap.set(name, existing.id);
      continue;
    }

    const created = await prisma.ingredient.create({
      data: {
        id: idBase + index,
        name,
      },
    });
    ingredientMap.set(name, created.id);
  }

  return ingredientMap;
};

const seedRecipes = async (ingredientMap: Map<string, number>) => {
  const categoryMap = new Map(
    (await prisma.category.findMany()).map((item) => [item.name, item.id])
  );
  const tagMap = new Map(
    (await prisma.tag.findMany()).map((item) => [item.name, item.id])
  );
  const cuisineMap = new Map(
    (await prisma.cuisineType.findMany()).map((item) => [item.name, item.id])
  );
  const seasonMap = new Map(
    (await prisma.season.findMany()).map((item) => [item.name, item.id])
  );
  const dietMap = new Map(
    (await prisma.specialDiet.findMany()).map((item) => [item.name, item.id])
  );

  for (const recipe of recipes) {
    const slug = slugify(recipe.title, { lower: true, strict: true });
    const userId = recipe.userId || users[0]?.id;
    if (!userId) {
      throw new Error("Seed requires at least one user.");
    }

    const upserted = await prisma.recipe.upsert({
      where: { slug },
      update: {
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl ?? "",
        userId,
        updatedAt: new Date(),
      },
      create: {
        title: recipe.title,
        slug,
        description: recipe.description,
        imageUrl: recipe.imageUrl ?? "",
        userId,
        createdAt: new Date(),
      },
    });

    const recipeId = upserted.id;

    await prisma.instruction.deleteMany({ where: { recipeId } });
    await prisma.recipeIngredient.deleteMany({ where: { recipeId } });
    await prisma.recipeCategory.deleteMany({ where: { recipeId } });
    await prisma.recipeTag.deleteMany({ where: { recipeId } });
    await prisma.recipeCuisineType.deleteMany({ where: { recipeId } });
    await prisma.recipeSeason.deleteMany({ where: { recipeId } });
    await prisma.recipeSpecialDiet.deleteMany({ where: { recipeId } });

    if (recipe.instructions?.length) {
      await prisma.instruction.createMany({
        data: recipe.instructions.map((instruction) => ({
          recipeId,
          step: instruction.step,
        })),
      });
    }

    if (recipe.ingredients?.length) {
      await prisma.recipeIngredient.createMany({
        data: recipe.ingredients
          .map((ingredient) => {
            const ingredientId = ingredientMap.get(ingredient.name.trim());
            if (!ingredientId) return null;
            return {
              recipeId,
              ingredientId,
              quantity: parseQuantity(ingredient.quantity),
              unit: ingredient.unit ?? null,
            };
          })
          .filter(Boolean) as Array<{
          recipeId: number;
          ingredientId: number;
          quantity: number | null;
          unit: string | null;
        }>,
      });
    }

    if (recipe.categories?.length) {
      await prisma.recipeCategory.createMany({
        data: recipe.categories
          .map((category) => {
            const categoryId = categoryMap.get(category.name);
            return categoryId ? { recipeId, categoryId } : null;
          })
          .filter(Boolean) as Array<{ recipeId: number; categoryId: number }>,
      });
    }

    if (recipe.tags?.length) {
      await prisma.recipeTag.createMany({
        data: recipe.tags
          .map((tag) => {
            const tagId = tagMap.get(tag.name.trim());
            return tagId ? { recipeId, tagId } : null;
          })
          .filter(Boolean) as Array<{ recipeId: number; tagId: number }>,
      });
    }

    if (recipe.cuisineTypes?.length) {
      await prisma.recipeCuisineType.createMany({
        data: recipe.cuisineTypes
          .map((cuisine) => {
            const cuisineTypeId = cuisineMap.get(cuisine.name);
            return cuisineTypeId ? { recipeId, cuisineTypeId } : null;
          })
          .filter(Boolean) as Array<{
          recipeId: number;
          cuisineTypeId: number;
        }>,
      });
    }

    if (recipe.seasonalEvent?.length) {
      await prisma.recipeSeason.createMany({
        data: recipe.seasonalEvent
          .map((season) => {
            const seasonId = seasonMap.get(season.name);
            return seasonId ? { recipeId, seasonId } : null;
          })
          .filter(Boolean) as Array<{ recipeId: number; seasonId: number }>,
      });
    }

    if (recipe.specialDiets?.length) {
      await prisma.recipeSpecialDiet.createMany({
        data: recipe.specialDiets
          .map((diet) => {
            const specialDietId = dietMap.get(diet.name);
            return specialDietId ? { recipeId, specialDietId } : null;
          })
          .filter(Boolean) as Array<{
          recipeId: number;
          specialDietId: number;
        }>,
      });
    }
  }
};

const main = async () => {
  if (!ensureSeedAllowed()) return;

  await upsertUsers();
  await upsertLookups();
  const ingredientMap = await upsertIngredients();
  await seedRecipes(ingredientMap);

  console.log("Seeding completed.");
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
