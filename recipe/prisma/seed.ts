import { PrismaClient } from "@prisma/client";
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

async function seedUsers() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
}

async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }
}
async function seedTags() {
  for (const tag of tagData) {
    await prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    });
  }
}

async function seedCuisineTypes() {
  for (const cuisine of cuisineTypes) {
    await prisma.cuisineType.upsert({
      where: { name: cuisine.name },
      update: {},
      create: cuisine,
    });
  }
}
async function seedSeasonal() {
  for (const season of seasonal) {
    await prisma.season.upsert({
      where: { name: season.name },
      update: {},
      create: season,
    });
  }
}

async function seedSpecialDiets() {
  for (const diet of specialDiets) {
    await prisma.specialDiet.upsert({
      where: { name: diet.name },
      update: {},
      create: diet,
    });
  }
}

async function seedRecipesAndAssociations() {
  const allCategories = await prisma.category.findMany();
  const allTags = await prisma.tag.findMany();
  const allCuisineTypes = await prisma.cuisineType.findMany();
  const allSpecialDiets = await prisma.specialDiet.findMany();
  const allSeasons = await prisma.season.findMany();

  for (const recipeData of recipes) {
    const createdRecipe = await prisma.recipe.create({
      data: {
        title: recipeData.title,
        description: recipeData.description,
        imageUrl: recipeData.imageUrl,
        userId: recipeData.userId,
        // Assuming direct creation of ingredients and instructions here if included
        ingredients: {
          create: recipeData.ingredients,
        },
        instructions: {
          create: recipeData.instructions,
        },
      },
    });

    //using prisma transaction should be optimal here - however since using a small data set for dev env. no need to add complexity
    // Associate categories with the recipe without duplicating entries
    for (const categoryData of recipeData?.categories ?? []) {
      const category = allCategories.find((c) => c.name === categoryData.name);
      if (category) {
        // Check if the association already exists
        const existingAssociation = await prisma.recipeCategory.findFirst({
          where: {
            categoryId: category.id,
            recipeId: createdRecipe.id,
          },
        });
        // Only create the new association if it does not exist
        if (!existingAssociation) {
          await prisma.recipeCategory.create({
            data: {
              categoryId: category.id,
              recipeId: createdRecipe.id,
            },
          });
        }
      }
    }

    // Similar logic for tags
    for (const recipeTag of recipeData?.tags ?? []) {
      const tag = allTags.find((c) => c.name === recipeTag.name);
      if (tag) {
        // Check if the tag association already exists
        const existingAssociation = await prisma.recipeTag.findFirst({
          where: {
            tagId: tag.id,
            recipeId: createdRecipe.id,
          },
        });
        // Only create the new association if it does not exist
        if (!existingAssociation) {
          await prisma.recipeTag.create({
            data: {
              tagId: tag.id,
              recipeId: createdRecipe.id,
            },
          });
        }
      }
    }

    // Similar logic for cuisineTypes
    for (const recipeCuisineType of recipeData?.cuisineTypes ?? []) {
      const cuisineType = allCuisineTypes.find(
        (c) => c.name === recipeCuisineType.name
      );
      if (cuisineType) {
        // Check if the tag association already exists
        const existingAssociation = await prisma.recipeCuisineType.findFirst({
          where: {
            cuisineTypeId: cuisineType.id,
            recipeId: createdRecipe.id,
          },
        });
        // Only create the new association if it does not exist
        if (!existingAssociation) {
          await prisma.recipeCuisineType.create({
            data: {
              cuisineTypeId: cuisineType.id,
              recipeId: createdRecipe.id,
            },
          });
        }
      }
    }
    // Similar logic for specialDients
    for (const recipeSpecialDiets of recipeData?.specialDiets ?? []) {
      const specialDiet = allSpecialDiets.find(
        (c) => c.name === recipeSpecialDiets.name
      );
      if (specialDiet) {
        // Check if the tag association already exists
        const existingAssociation = await prisma.recipeSpecialDiet.findFirst({
          where: {
            specialDietId: specialDiet.id,
            recipeId: createdRecipe.id,
          },
        });
        // Only create the new association if it does not exist
        if (!existingAssociation) {
          await prisma.recipeSpecialDiet.create({
            data: {
              specialDietId: specialDiet.id,
              recipeId: createdRecipe.id,
            },
          });
        }
      }
    }
    // Similar logic for Seasons
    for (const recipeSeason of recipeData?.seasonalEvent ?? []) {
      const season = allSeasons.find((c) => c.name === recipeSeason.name);
      if (season) {
        // Check if the tag association already exists
        const existingAssociation = await prisma.recipeSeason.findFirst({
          where: {
            seasonId: season.id,
            recipeId: createdRecipe.id,
          },
        });
        // Only create the new association if it does not exist
        if (!existingAssociation) {
          await prisma.recipeSeason.create({
            data: {
              seasonId: season.id,
              recipeId: createdRecipe.id,
            },
          });
        }
      }
    }

    // Similarly, associate tags and other entities by repeating a similar process
  }
}

async function main() {
  console.log("seeding initiated");
  const data = await prisma.recipe.findMany();
  if (data.length > 0) {
    console.log("seeding not required");
    return;
  }
  await seedUsers();
  await seedCategories();
  await seedTags();
  await seedCuisineTypes();
  await seedSeasonal();
  await seedSpecialDiets();
  await seedRecipesAndAssociations();
  // Include calls to seed other entities as needed

  console.log("seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
