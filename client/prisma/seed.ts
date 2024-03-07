import {
  users,
  categories,
  recipes,
  tagData,
  cuisineTypes,
  seasonal,
  specialDiets,
} from "../app/(site)/foods/data/foodData";
import { FoodItemProps } from "@/app/(site)/models/types/types";
import { PrismaClient } from "@prisma/client";

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
  await seedUsers();
  await seedCategories();
  await seedTags();
  await seedCuisineTypes();
  await seedSeasonal();
  await seedSpecialDiets();
  await seedRecipesAndAssociations();
  // Include calls to seed other entities as needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// async function main() {
//   // Seed Categories, CuisineTypes, Seasonal, SpecialDiets, Tags

//   await Promise.all([
//     ...users.map((user) => {
//       return prisma.user.upsert({
//         // Ensure you're returning the promise
//         where: { email: user.email },
//         update: {},
//         create: user,
//       });
//     }),
//     ...categories.map((cat) => {
//       return prisma.category.upsert({
//         // Ensure you're returning the promise
//         where: { name: cat.name },
//         update: {},
//         create: cat,
//       });
//     }),
//     ...cuisineTypes.map((type) => {
//       return prisma.cuisineType.upsert({
//         // Ensure you're returning the promise
//         where: { name: type.name },
//         update: {},
//         create: type,
//       });
//     }),
//     ...seasonal.map((season) => {
//       return prisma.season.upsert({
//         // Ensure you're returning the promise
//         where: { name: season.name },
//         update: {},
//         create: season,
//       });
//     }),
//     ...specialDiets.map((diet) => {
//       return prisma.specialDiet.upsert({
//         // Ensure you're returning the promise
//         where: { name: diet.name },
//         update: {},
//         create: diet,
//       });
//     }),
//     ...tagData.map((tag) => {
//       return prisma.tag.upsert({
//         // Ensure you're returning the promise
//         where: { name: tag },
//         update: {},
//         create: { name: tag },
//       });
//     }),
//   ]);

//   const allTage = await prisma.tag.findMany();
//   const allCategories = await prisma.category.findMany();

//   for (const recipe of recipes) {
//     await dynamicallyAssociateRecipe(recipe);
//   }
// }

// main()
//   .then(() => prisma.$disconnect())
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

// async function dynamicallyAssociateRecipe(recipeData: any) {
//   // First, ensure the recipe's related entities like users, categories, and tags exist

//   // Fetch all categories and tags to be used for dynamic association
//   const allCategories = await prisma.category.findMany();
//   const allTags = await prisma.tag.findMany();
//   const allSeasons = await prisma.season.findMany();
//   const allSpecialDiets = await prisma.specialDiet.findMany();
//   const allCuisines = await prisma.cuisineType.findMany();
//   const user1 = await prisma.user.findUnique({
//     where: { email: "admin@anchordiv.com" },
//   });

//   if (!user1) throw new Error("Admin user not found");

//   // Create the recipe without associations first
//   const recipe = await prisma.recipe.create({
//     data: {
//       title: recipeData.title,
//       description: recipeData.description,
//       imageUrl: recipeData.imageUrl,
//       userId: user1?.id,
//       ingredients: {
//         create: recipeData.ingredients.map(
//           (ingredient: { name: string; quantity: string }) => ({
//             name: ingredient.name,
//             quantity: ingredient.quantity || "", // Provide a default value if quantity is optional
//           })
//         ),
//       },
//       instructions: {
//         create: recipeData.instructions.map(
//           (instruction: { step: string }) => ({
//             step: instruction.step || "",
//           })
//         ),
//       },

//       // Directly create ingredients and instructions here if included in recipeData
//     },
//   });

//   // Dynamically determine associations based on recipe content
//   const categoriesToAssociate = allCategories.filter(
//     (cat) =>
//       recipeData.title.includes(cat.name) ||
//       recipeData.description.includes(cat.name)
//   );
//   const tagsToAssociate = allTags.filter(
//     (tag) =>
//       recipeData.title.includes(tag.name) ||
//       recipeData.description.includes(tag.name)
//   );

//   // Create associations with categories and tags
//   for (const cat of categoriesToAssociate) {
//     await prisma.recipeCategory.create({
//       data: {
//         categoryId: cat.id,
//         recipeId: recipe.id,
//       },
//     });
//   }

//   for (const tag of tagsToAssociate) {
//     // could be made generic to follow DRY principles
//     const existingTagAssociation = await prisma.recipeTag.findFirst({
//       where: {
//         recipeId: recipe.id,
//         tagId: tag.id,
//       },
//     });
//     if (!existingTagAssociation) {
//       await prisma.recipeTag.create({
//         data: {
//           tagId: tag.id,
//           recipeId: recipe.id,
//         },
//       });
//     }
//   }

//   for (const season of allSeasons) {
//     // could be made generic to follow DRY principles
//     const existingSeasonAssociation = await prisma.recipeSeason.findFirst({
//       where: {
//         recipeId: recipe.id,
//         seasonId: season.id,
//       },
//     });
//     if (!existingSeasonAssociation) {
//       await prisma.recipeSeason.create({
//         data: {
//           seasonId: season.id,
//           recipeId: recipe.id,
//         },
//       });
//     }
//   }
//   for (const cuisine of allCuisines) {
//     // could be made generic to follow DRY principles
//     const existingSeasonAssociation = await prisma.recipeCuisineType.findFirst({
//       where: {
//         cuisineTypeId: cuisine.id,
//         recipeId: recipe.id,
//       },
//     });
//     if (!existingSeasonAssociation) {
//       await prisma.recipeCuisineType.create({
//         data: {
//           cuisineTypeId: cuisine.id,
//           recipeId: recipe.id,
//         },
//       });
//     }
//   }

//   const tagNamesToAssociate = recipeData.tags.map(
//     (tag: { name: string }) => tag.name
//   );
//   const catNamesToAssociate = recipeData.categories.map(
//     (cat: { name: string }) => cat.name
//   );

//   console.log("tags -", tagNamesToAssociate, "cats", catNamesToAssociate);

//   const tagRecords = await prisma.tag.findMany({
//     where: {
//       name: {
//         in: tagNamesToAssociate, // `tags` should be an array of tag names you want to associate
//       },
//     },
//   });

//   const catRecords = await prisma.category.findMany({
//     where: {
//       name: {
//         in: catNamesToAssociate,
//       },
//     },
//   });

//   await Promise.all([
//     ...tagRecords.map((tag) => {
//       return prisma.recipeTag.create({
//         data: {
//           tagId: tag.id,
//           recipeId: recipe.id,
//         },
//       });
//     }),
//     ...catRecords.map((cat) => {
//       return prisma.recipeCategory.create({
//         data: {
//           categoryId: cat.id,
//           recipeId: recipe.id,
//         },
//       });
//     }),
//     //add other associations
//   ]);

//   // Similarly, create associations for seasons, cuisine types, etc., based on dynamic analysis

//   console.log("Recipe and associations created dynamically.");
// }
