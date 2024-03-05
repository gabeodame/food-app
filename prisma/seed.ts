import { FoodItemProps } from "@/app/(site)/models/types/types";
import { PrismaClient } from "@prisma/client";

const recipes: FoodItemProps[] = [
  {
    title: "Avocado Rolls Sushi Grande",
    description:
      "A large-sized sushi roll featuring creamy avocado and perfectly seasoned sushi rice, wrapped in nori.",
    imageUrl:
      "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    userId: 1, // Example userId, adjust based on actual users created
    categories: [
      { name: "Appetizers & Snacks" },
      { name: "Main Courses" },
      { name: "Side Dishes" },
      { name: "Seafood" },
    ], // Category names, assumes you fetch or map these to actual category IDs
    tags: [{ name: "No-Cook" }, { name: "Traditional" }],
    ingredients: [
      { name: "cups sushi rice, cooked and seasoned", quantity: "2" },
      { name: "sheets nori (seaweed)", quantity: " 4 " },
      { name: "large avocado, thinly sliced", quantity: "1 " },
      {
        name: "Soy sauce, wasabi, and pickled ginger, for serving",
        quantity: "1",
      },
    ],
    instructions: [
      { step: "Lay a sheet of nori on a bamboo sushi mat." },
      {
        step: "Spread sushi rice on the nori, leaving a small margin at the top.",
      },
      { step: "Arrange avocado slices over the rice." },
      { step: "Roll the sushi tightly using the bamboo mat." },
      { step: "Cut the roll into 6-8 pieces." },
      { step: "Serve with soy sauce, wasabi, and pickled ginger." },
    ],
  },
  {
    userId: 1,
    title: "Avocado Rolls Sushi",
    imageUrl:
      "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A classic sushi roll with creamy avocado, ideal for sushi lovers looking for a vegetarian option.",
    categories: [
      { name: "Appetizers & Snacks" },
      { name: "Main Courses" },
      { name: "Side Dishes" },
      { name: "Seafood" },
    ], // Category names, assumes you fetch or map these to actual category IDs
    tags: [{ name: "No-Cook" }, { name: "Traditional" }],

    ingredients: [
      { name: "cup sushi rice, cooked and seasoned", quantity: "1" },
      { name: "sheets nori (seaweed)", quantity: "2" },
      { name: "avocado, sliced", quantity: "1" },
      { name: "Soy sauce and wasabi, for serving", quantity: "to taste" },
    ],
    instructions: [
      { step: "Spread seasoned sushi rice on a sheet of nori." },
      { step: "Add avocado slices on top of the rice." },
      { step: "Roll the nori and rice tightly into a roll." },
      { step: "Slice the roll into bite-sized pieces." },
      { step: "Serve with soy sauce and wasabi." },
    ],
  },
  {
    userId: 1,
    title: "Pancake Stack",
    imageUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=3360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Fluffy pancakes stacked high, served with maple syrup and a pat of butter.",
    categories: [
      { name: "Breakfast" },
      { name: "Brunch" },
      { name: "Desserts" }, // Pancakes can also fit into a dessert category for some
    ],
    tags: [
      { name: "Quick Meals (Under 30 Minutes)" }, // Assuming the preparation is quick
      { name: "Beginner-Friendly" }, // Cooking pancakes is typically considered beginner-friendly
      { name: "Comfort Food" }, // Pancakes are often considered comfort food
    ],

    ingredients: [
      { name: "cups all-purpose flour", quantity: "2" },
      { name: "tablespoons sugar", quantity: "2" },
      { name: "tablespoon baking powder", quantity: "1" },
      { name: "teaspoon salt", quantity: "1/2" },
      { name: "eggs", quantity: "2" },
      { name: "cups milk", quantity: "1 1/2 " },
      { name: "tablespoons melted butter", quantity: "4" },
      { name: "Maple syrup and extra butter, for serving", quantity: "" },
    ],
    instructions: [
      {
        step: "In a large bowl, mix together flour, sugar, baking powder, and salt.",
      },
      { step: "In another bowl, beat the eggs with milk and melted butter." },
      { step: "Combine the wet and dry ingredients until smooth." },
      {
        step: "Heat a griddle over medium heat and pour 1/4 cup batter for each pancake.",
      },
      {
        step: "Cook until bubbles form on the surface, then flip and cook until golden.",
      },
      { step: "Serve hot with butter and maple syrup." },
    ],
  },
  {
    userId: 1,
    title: "Yellow Spaghetti",
    imageUrl:
      "https://images.unsplash.com/photo-1579631542720-3a87824fff86?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Savory spaghetti dish with a golden hue, featuring a blend of spices and herbs.",
    categories: [
      { name: "Pasta" },
      { name: "Italian Cuisine" },
      { name: "Dinner" }, // Assuming this dish is typically served for dinner
    ],
    tags: [
      { name: "Spaghetti" }, // Keeping specific tags for dish type
      { name: "Turmeric" }, // Adding specific ingredients as tags for flavor profile
      { name: "Quick Meals (Under 30 Minutes)" }, // Assuming the preparation time is quick
      { name: "Chef-Level" }, // Considering the use of specific spices might require some culinary skill
    ],

    ingredients: [
      { name: "lb spaghetti", quantity: "1" },
      { name: "tablespoons olive oil", quantity: "2" },
      { name: "cloves garlic, minced", quantity: "4" },
      { name: "teaspoon turmeric", quantity: "1" },
      { name: "teaspoon chili flakes", quantity: "1/2" },
      { name: "Salt and pepper to taste", quantity: "" },
      { name: "Grated Parmesan cheese, for serving", quantity: "" },
    ],
    instructions: [
      { step: "Cook spaghetti according to package instructions; drain." },
      {
        step: "In a pan, heat olive oil over medium heat. Add garlic, turmeric, and chili flakes.",
      },
      { step: "Add cooked spaghetti to the pan and toss with spices." },
      { step: "Season with salt and pepper." },
      { step: "Serve with grated Parmesan cheese on top." },
    ],
  },
  {
    userId: 1,
    title: "Pasta with Tomato & Cheese",
    imageUrl:
      "https://images.unsplash.com/photo-1587206668283-c21d974993c3?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A simple yet delicious pasta dish featuring a rich tomato sauce and melted cheese.",
    categories: [
      { name: "Pasta" },
      { name: "Italian Cuisine" },
      { name: "Vegetarian" },
      { name: "Dinner" }, // Assuming this dish is typically served for dinner
    ],
    tags: [
      { name: "Quick Meals (Under 30 Minutes)" },
      { name: "Comfort Food" },
      { name: "Cheese" },
      { name: "Tomato" },
    ],

    ingredients: [
      { name: "lb pasta of your choice", quantity: "1" },
      { name: "tablespoons olive oil", quantity: "2" },
      { name: "onion, finely chopped", quantity: "1" },
      { name: "garlic cloves, minced", quantity: "2" },
      { name: " crushed tomatoes", quantity: "1 can (14 oz)" },
      { name: "Salt and pepper to taste", quantity: "" },
      { name: "cup shredded mozzarella cheese", quantity: "1" },
      { name: "Fresh basil leaves, for garnish", quantity: "" },
    ],
    instructions: [
      { step: "Cook pasta according to package instructions; drain." },
      {
        step: "In a large skillet, heat olive oil over medium heat. Add onion and garlic, cooking until soft.",
      },
      {
        step: "Add crushed tomatoes to the skillet. Season with salt and pepper. Simmer for 15 minutes.",
      },
      { step: "Toss the cooked pasta with the tomato sauce." },
      {
        step: "Top with shredded mozzarella cheese and melt under a broiler for 2-3 minutes.",
      },
      { step: "Garnish with fresh basil leaves before serving." },
    ],
  },
  {
    userId: 1,
    title: "Ravioli with Tomato Cuts",
    imageUrl:
      "https://images.unsplash.com/photo-1617474019977-0e105d1b430e?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Homemade ravioli filled with a flavorful cheese mixture, served with a fresh tomato sauce.",
    categories: [
      { name: "Pasta" },
      { name: "Italian Cuisine" },
      { name: "Homemade" },
      { name: "Dinner" }, // Since it's a more involved dish, likely for a special dinner
    ],
    tags: [
      { name: "Ravioli" },
      { name: "Tomato" },
      { name: "Cheese" },
      { name: "Weekend Projects (Over 2 Hours)" }, // Assuming it takes more time to prepare
    ],

    ingredients: [
      { name: "For the ravioli:", quantity: "" },
      { name: "cups all-purpose flour", quantity: "2" },
      { name: "eggs", quantity: "3" },
      { name: " ricotta cheese", quantity: "1/2 cup" },
      { name: " grated Parmesan cheese", quantity: "1/4 cup" },
      { name: "Salt and pepper to taste", quantity: "" },
      { name: "For the sauce:", quantity: "" },
    ],
    instructions: [
      {
        step: "Make the ravioli dough by combining flour and eggs. Knead into a smooth dough, rest for 30 minutes.",
      },
      { step: "Mix ricotta, Parmesan, salt, and pepper for the filling." },
      {
        step: "Roll out the dough, place small amounts of filling on the dough, and cover with another layer of dough. Seal the edges and cut into individual ravioli.",
      },
      { step: "Cook ravioli in boiling water for 4-5 minutes." },
      {
        step: "For the sauce, heat olive oil and cook garlic until fragrant. Add tomatoes and simmer until soft. Season with salt, pepper, and basil.",
      },
      {
        step: "Serve ravioli topped with tomato sauce and additional grated Parmesan.",
      },
    ],
  },
  // Add more recipes as needed
];

const users = [
  {
    email: "admin@anchordiv.com",
    name: "Admin",
    password: "hashedpassword1",
  },
  {
    email: "user1@example.com",
    name: "John Doe",
    password: "hashedpassword1",
  },
  {
    email: "user2@example.com",
    name: "Jane Doe",
    password: "hashedpassword2",
  },
  // Add more users as needed
];

const categories = [
  { name: "Appetizers & Snacks" },
  { name: "Main Courses" },
  { name: "Side Dishes" },
  { name: "Desserts" },
  { name: "Beverages" },
  { name: "Seafood" },
  { name: "Breakfast" },
  { name: "Lunch" },
  { name: "Dinner" },
  { name: "Brunch" },
];

const cuisineTypes = [
  { name: "American" },
  { name: "Italian" },
  { name: "Mexican" },
  { name: "African" },
  { name: "Chinese" },
  { name: "Indian" },
  { name: "French" },
  { name: "Japanese" },
  { name: "Mediterranean" },
  { name: "Thai" },
  { name: "Middle Eastern" },
];

const seasonal = [
  { name: "Summer BBQs" },
  { name: "Holiday Feasts" },
  { name: "Spring Picnics" },
  { name: "Winter Warmers" },
  { name: "Autumn Harvest" },
  { name: "New Year's Celebrations" },
  { name: "Valentine's Day Dinners" },
  { name: "Easter Brunches" },
  { name: "Halloween Treats" },
  { name: "Wedding Showers" },
];

const specialDiets = [
  { name: "Vegetarian" },
  { name: "Vegan" },
  { name: "Gluten-Free" },
  { name: "Keto" },
  { name: "Paleo" },
  { name: "Diary-Free" },
  { name: "Low Carb" },
  { name: "whole30" },
  { name: "Pescatarian" },
  { name: "Sugar-Free" },
];

const tagData = [
  // Cooking Methods
  "Baked",
  "Grilled",
  "Slow-Cooked",
  "No-Cook",
  "Stir-Fried",
  // Cooking Time
  "Quick Meals (Under 30 Minutes)",
  "Weekend Projects (Over 2 Hours)",
  "Make-Ahead",
  // Ingredients
  "Chicken",
  "Beef",
  "Seafood",
  "Pasta",
  "Rice",
  "Beans",
  "Lentils",
  "Turmeric",
  "Chocolate",
  "Seasonal Vegetables",
  "Exotic Spices",

  // Skill Level
  "Beginner-Friendly",
  "Intermediate",
  "Advanced",
  "Chef-Level",

  // Occasions,
  " Family Dinner",
  "Date Night",
  "Potluck",
  "Picnic",
  "Party",
  // Trends:
  "Fermented Foods",
  "Superfoods",
  "Plant-Based",
  "Comfort Food",
  "Street Food",

  // Health Focus:
  "Heart-Healthy",
  "Low Sodium",
  "High Fiber",
  "Protein-Rich",
  "Antioxidant-Rich",

  // Cultural,
  "Traditional",
  "Fusion",
  "Modern",
  "Heirloom Recipes",
  "Regional Specialties",

  // Equipment Needed:
  "No-Bake",
  "Slow Cooker",
  "Instant Pot",
  "Blender Recipes",
  "One-Pan Meals",

  // Dietary Needs:
  "Allergy-Friendly ",
  "Low Sugar",
  "High Calcium",
  "Iron-Rich",
];

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

async function seedRecipesAndAssociations() {
  const allCategories = await prisma.category.findMany();

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

    // Associate categories with the recipe
    for (const categoryData of recipeData?.categories ?? []) {
      const category = allCategories.find((c) => c.name === categoryData.name);
      if (category) {
        await prisma.recipeOnCategories.create({
          data: {
            categoryId: category.id,
            recipeId: createdRecipe.id,
          },
        });
      }
    }

    // Similarly, associate tags and other entities by repeating a similar process
  }
}

async function main() {
  await seedUsers();
  await seedCategories();
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
