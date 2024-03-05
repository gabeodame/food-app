// import { FoodItemProps } from "../../models/types/types";

//recipes
export const recipes = [
  {
    title: "Avocado Rolls Sushi Grande",
    description:
      "A large-sized sushi roll featuring creamy avocado and perfectly seasoned sushi rice, wrapped in nori.",
    imageUrl:
      "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    userId: 1, // Example userId, adjust based on actual users created
    categories: [{ name: "Vegetarian" }], // Category names, assumes you fetch or map these to actual category IDs
    ingredients: [
      { name: "cups sushi rice, cooked and seasoned", quantity: "2" },
      { name: "sheets nori (seaweed)", quantity: " 4 " },
      { name: "large avocado, thinly sliced", quantity: "1 " },
      {
        name: "Soy sauce, wasabi, and pickled ginger, for serving",
        //   quantity: 1,
      },
    ],
    instructions: [
      "Lay a sheet of nori on a bamboo sushi mat.",
      "Spread sushi rice on the nori, leaving a small margin at the top.",
      "Arrange avocado slices over the rice.",
      "Roll the sushi tightly using the bamboo mat.",
      "Cut the roll into 6-8 pieces.",
      "Serve with soy sauce, wasabi, and pickled ginger.",
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
      { name: "Sushi" },
      { name: "Japanese Cuisine" },
      { name: "Vegetarian" },
    ],
    tag: ["Avocado", "Sushi"],

    ingredients: [
      { name: "cup sushi rice, cooked and seasoned", quantity: "1" },
      { name: "sheets nori (seaweed)", quantity: "2" },
      { name: "avocado, sliced", quantity: "1" },
      { name: "Soy sauce and wasabi, for serving" },
    ],
    instructions: [
      "Spread seasoned sushi rice on a sheet of nori.",
      "Add avocado slices on top of the rice.",
      "Roll the nori and rice tightly into a roll.",
      "Slice the roll into bite-sized pieces.",
      "Serve with soy sauce and wasabi.",
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
      { name: "American Cuisine" },
      { name: "Pancakes" },
    ],
    tag: ["Pancake", "Breakfast", "Brunch"],

    ingredients: [
      { name: "cups all-purpose flour", quantity: "2" },
      { name: "tablespoons sugar", quantity: "2" },
      { name: "tablespoon baking powder", quantity: "1" },
      { name: "teaspoon salt", quantity: "1/2" },
      { name: "eggs", quantity: "2" },
      { name: "cups milk", quantity: "1 1/2 " },
      { name: "tablespoons melted butter", quantity: "4" },
      { name: "Maple syrup and extra butter, for serving", quantity: "4" },
    ],
    instructions: [
      "In a large bowl, mix together flour, sugar, baking powder, and salt.",
      "In another bowl, beat the eggs with milk and melted butter.",
      "Combine the wet and dry ingredients until smooth.",
      "Heat a griddle over medium heat and pour 1/4 cup batter for each pancake.",
      "Cook until bubbles form on the surface, then flip and cook until golden.",
      "Serve hot with butter and maple syrup.",
    ],
  },
  {
    userId: 1,
    title: "Yellow Spaghetti",
    imageUrl:
      "https://images.unsplash.com/photo-1579631542720-3a87824fff86?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Savory spaghetti dish with a golden hue, featuring a blend of spices and herbs.",
    categories: [{ name: "Pasta" }, { name: "Italian Cuisine" }],
    tag: ["Spaghetti", "Pasta"],

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
      "Cook spaghetti according to package instructions; drain.",
      "In a pan, heat olive oil over medium heat. Add garlic, turmeric, and chili flakes.",
      "Add cooked spaghetti to the pan and toss with spices.",
      "Season with salt and pepper.",
      "Serve with grated Parmesan cheese on top.",
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
    ],
    tag: ["Pasta", "Tomato", "Cheese"],

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
      "Cook pasta according to package instructions; drain.",
      "In a large skillet, heat olive oil over medium heat. Add onion and garlic, cooking until soft.",
      "Add crushed tomatoes to the skillet. Season with salt and pepper. Simmer for 15 minutes.",
      "Toss the cooked pasta with the tomato sauce.",
      "Top with shredded mozzarella cheese and melt under a broiler for 2-3 minutes.",
      "Garnish with fresh basil leaves before serving.",
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
    ],
    tag: ["Ravioli", "Pasta", "Tomato"],

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
      "Make the ravioli dough by combining flour and eggs. Knead into a smooth dough, rest for 30 minutes.",
      "Mix ricotta, Parmesan, salt, and pepper for the filling.",
      "Roll out the dough, place small amounts of filling on the dough, and cover with another layer of dough. Seal the edges and cut into individual ravioli.",
      "Cook ravioli in boiling water for 4-5 minutes.",
      "For the sauce, heat olive oil and cook garlic until fragrant. Add tomatoes and simmer until soft. Season with salt, pepper, and basil.",
      "Serve ravioli topped with tomato sauce and additional grated Parmesan.",
    ],
  },
  // Add more recipes as needed
];

// export const foodData: FoodItemProps[] = [
//   // {
//   //   id: "1",
//   //   title: "Avocado Rolls Sushi Grande",
//   //   imageUrl:
//   //     "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   //   description:
//   //     "A large-sized sushi roll featuring creamy avocado and perfectly seasoned sushi rice, wrapped in nori.",
//   //   categories: ["Sushi", "Japanese Cuisine", "Vegetarian"],
//   //   tag: ["Avocado", "Sushi"],
//   //   recipes: {
//   //     ingredients: [
//   //       "2 cups sushi rice, cooked and seasoned",
//   //       "4 sheets nori (seaweed)",
//   //       "1 large avocado, thinly sliced",
//   //       "Soy sauce, wasabi, and pickled ginger, for serving",
//   //     ],
//   //     instructions: [
//   //       "Lay a sheet of nori on a bamboo sushi mat.",
//   //       "Spread sushi rice on the nori, leaving a small margin at the top.",
//   //       "Arrange avocado slices over the rice.",
//   //       "Roll the sushi tightly using the bamboo mat.",
//   //       "Cut the roll into 6-8 pieces.",
//   //       "Serve with soy sauce, wasabi, and pickled ginger.",
//   //     ],
//   //   },
//   // },
//   {
//     userId: 1,
//     title: "Avocado Rolls Sushi",
//     imageUrl:
//       "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description:
//       "A classic sushi roll with creamy avocado, ideal for sushi lovers looking for a vegetarian option.",
//     categories: [
//       { name: "Sushi" },
//       { name: "Japanese Cuisine" },
//       { name: "Vegetarian" },
//     ],
//     tag: ["Avocado", "Sushi"],

//     ingredients: [
//       { name: "cup sushi rice, cooked and seasoned", quantity: "1" },
//       { name: "sheets nori (seaweed)", quantity: "2" },
//       { name: "avocado, sliced", quantity: "1" },
//       { name: "Soy sauce and wasabi, for serving" },
//     ],
//     instructions: [
//       "Spread seasoned sushi rice on a sheet of nori.",
//       "Add avocado slices on top of the rice.",
//       "Roll the nori and rice tightly into a roll.",
//       "Slice the roll into bite-sized pieces.",
//       "Serve with soy sauce and wasabi.",
//     ],
//   },
//   {
//     userId: 1,
//     title: "Pancake Stack",
//     imageUrl:
//       "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=3360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description:
//       "Fluffy pancakes stacked high, served with maple syrup and a pat of butter.",
//     categories: [
//       { name: "Breakfast" },
//       { name: "American Cuisine" },
//       { name: "Pancakes" },
//     ],
//     tag: ["Pancake", "Breakfast", "Brunch"],

//     ingredients: [
//       { name: "cups all-purpose flour", quantity: "2" },
//       { name: "tablespoons sugar", quantity: "2" },
//       { name: "tablespoon baking powder", quantity: "1" },
//       { name: "teaspoon salt", quantity: "1/2" },
//       { name: "eggs", quantity: "2" },
//       { name: "cups milk", quantity: "1 1/2 " },
//       { name: "tablespoons melted butter", quantity: "4" },
//       { name: "Maple syrup and extra butter, for serving", quantity: "4" },
//     ],
//     instructions: [
//       "In a large bowl, mix together flour, sugar, baking powder, and salt.",
//       "In another bowl, beat the eggs with milk and melted butter.",
//       "Combine the wet and dry ingredients until smooth.",
//       "Heat a griddle over medium heat and pour 1/4 cup batter for each pancake.",
//       "Cook until bubbles form on the surface, then flip and cook until golden.",
//       "Serve hot with butter and maple syrup.",
//     ],
//   },
//   {
//     userId: 1,
//     title: "Yellow Spaghetti",
//     imageUrl:
//       "https://images.unsplash.com/photo-1579631542720-3a87824fff86?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description:
//       "Savory spaghetti dish with a golden hue, featuring a blend of spices and herbs.",
//     categories: [{ name: "Pasta" }, { name: "Italian Cuisine" }],
//     tag: ["Spaghetti", "Pasta"],

//     ingredients: [
//       { name: "lb spaghetti", quantity: "1" },
//       { name: "tablespoons olive oil", quantity: "2" },
//       { name: "cloves garlic, minced", quantity: "4" },
//       { name: "teaspoon turmeric", quantity: "1" },
//       { name: "teaspoon chili flakes", quantity: "1/2" },
//       { name: "Salt and pepper to taste", quantity: "" },
//       { name: "Grated Parmesan cheese, for serving", quantity: "" },
//     ],
//     instructions: [
//       "Cook spaghetti according to package instructions; drain.",
//       "In a pan, heat olive oil over medium heat. Add garlic, turmeric, and chili flakes.",
//       "Add cooked spaghetti to the pan and toss with spices.",
//       "Season with salt and pepper.",
//       "Serve with grated Parmesan cheese on top.",
//     ],
//   },
//   {
//     userId: 1,
//     title: "Pasta with Tomato & Cheese",
//     imageUrl:
//       "https://images.unsplash.com/photo-1587206668283-c21d974993c3?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description:
//       "A simple yet delicious pasta dish featuring a rich tomato sauce and melted cheese.",
//     categories: [
//       { name: "Pasta" },
//       { name: "Italian Cuisine" },
//       { name: "Vegetarian" },
//     ],
//     tag: ["Pasta", "Tomato", "Cheese"],

//     ingredients: [
//       { name: "lb pasta of your choice", quantity: "1" },
//       { name: "tablespoons olive oil", quantity: "2" },
//       { name: "onion, finely chopped", quantity: "1" },
//       { name: "garlic cloves, minced", quantity: "2" },
//       { name: " crushed tomatoes", quantity: "1 can (14 oz)" },
//       { name: "Salt and pepper to taste", quantity: "" },
//       { name: "cup shredded mozzarella cheese", quantity: "1" },
//       { name: "Fresh basil leaves, for garnish", quantity: "" },
//     ],
//     instructions: [
//       "Cook pasta according to package instructions; drain.",
//       "In a large skillet, heat olive oil over medium heat. Add onion and garlic, cooking until soft.",
//       "Add crushed tomatoes to the skillet. Season with salt and pepper. Simmer for 15 minutes.",
//       "Toss the cooked pasta with the tomato sauce.",
//       "Top with shredded mozzarella cheese and melt under a broiler for 2-3 minutes.",
//       "Garnish with fresh basil leaves before serving.",
//     ],
//   },
//   {
//     userId: 1,
//     title: "Ravioli with Tomato Cuts",
//     imageUrl:
//       "https://images.unsplash.com/photo-1617474019977-0e105d1b430e?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     description:
//       "Homemade ravioli filled with a flavorful cheese mixture, served with a fresh tomato sauce.",
//     categories: [
//       { name: "Pasta" },
//       { name: "Italian Cuisine" },
//       { name: "Homemade" },
//     ],
//     tag: ["Ravioli", "Pasta", "Tomato"],

//     ingredients: [
//       { name: "For the ravioli:", quantity: "" },
//       { name: "cups all-purpose flour", quantity: "2" },
//       { name: "eggs", quantity: "3" },
//       { name: " ricotta cheese", quantity: "1/2 cup" },
//       { name: " grated Parmesan cheese", quantity: "1/4 cup" },
//       { name: "Salt and pepper to taste", quantity: "" },
//       { name: "For the sauce:", quantity: "" },
//     ],
//     instructions: [
//       "Make the ravioli dough by combining flour and eggs. Knead into a smooth dough, rest for 30 minutes.",
//       "Mix ricotta, Parmesan, salt, and pepper for the filling.",
//       "Roll out the dough, place small amounts of filling on the dough, and cover with another layer of dough. Seal the edges and cut into individual ravioli.",
//       "Cook ravioli in boiling water for 4-5 minutes.",
//       "For the sauce, heat olive oil and cook garlic until fragrant. Add tomatoes and simmer until soft. Season with salt, pepper, and basil.",
//       "Serve ravioli topped with tomato sauce and additional grated Parmesan.",
//     ],
//   },
// ];
// // {
// //   userId: 1,
// //   title: "Alfredo Pasta",
// //   imageUrl:
// //     "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   description:
// //     "Creamy Alfredo pasta with a rich sauce made from butter, cream, and Parmesan cheese.",
// //   categories: ["Pasta", "Italian Cuisine", "Comfort Food"],
// //   tag: ["Alfredo", "Pasta"],

// //   ingredients: [
// //     "1 lb fettuccine pasta",
// //     "1/2 cup butter",
// //     "1 cup heavy cream",
// //     "1 clove garlic, minced",
// //     "1 1/2 cups grated Parmesan cheese",
// //     "Salt and pepper to taste",
// //     "Parsley, chopped for garnish",
// //   ],
// //   instructions: [
// //     "Cook fettuccine according to package instructions; drain.",
// //     "In a saucepan, melt butter over medium heat. Add garlic and sauté briefly.",
// //     "Add heavy cream and bring to a simmer. Reduce heat and stir in Parmesan cheese until melted and smooth.",
// //     "Season the sauce with salt and pepper.",
// //     "Toss the cooked pasta with the Alfredo sauce.",
// //     "Garnish with chopped parsley before serving.",
// //   ],
// // },
// // {
// //   id: "8",
// //   title: "Pad Thai",
// //   imageUrl:
// //     "https://images.unsplash.com/photo-1637806930600-37fa8892069d?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   description:
// //     "A traditional Thai noodle dish, stir-fried with eggs, fish sauce, tamarind juice, and red chili pepper, garnished with roasted peanuts.",
// //   categories: ["Noodles", "Thai Cuisine", "Street Food"],
// //   tag: ["Thai", "Noodle"],
// //   recipes: {
// //     ingredients: [
// //       "8 oz Thai rice noodles",
// //       "2 tablespoons oil",
// //       "1 egg, lightly beaten",
// //       "1/4 cup fish sauce",
// //       "1/4 cup tamarind paste",
// //       "2 tablespoons brown sugar",
// //       "1/2 cup roasted peanuts, crushed",
// //       "1 cup bean sprouts",
// //       "Green onions and lime wedges for garnish",
// //     ],
// //     instructions: [
// //       "Soak rice noodles in warm water for 30 minutes; drain.",
// //       "Heat oil in a wok over medium-high heat. Add the egg and scramble until fully cooked.",
// //       "Add noodles and stir-fry for a few minutes.",
// //       "Mix fish sauce, tamarind paste, and brown sugar in a bowl. Add to the wok and toss to combine.",
// //       "Stir in peanuts and bean sprouts.",
// //       "Serve garnished with green onions and lime wedges.",
// //     ],
// //   },
// // },
// // {
// //   id: "9",
// //   title: "Angus Burger",
// //   imageUrl:
// //     "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2097&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   description:
// //     "Juicy Angus beef burger served on a toasted bun with lettuce, tomato, and your choice of condiments.",
// //   categories: ["Burgers", "American Cuisine", "Grilled"],
// //   tag: ["Pork", "Meat", "Grilled", "Burger"],
// //   recipes: {
// //     ingredients: [
// //       "1 lb Angus ground beef",
// //       "Salt and pepper to taste",
// //       "4 hamburger buns, toasted",
// //       "Lettuce, tomato slices, and onion slices",
// //       "Ketchup, mustard, and mayonnaise, for serving",
// //       "Cheese slices (optional)",
// //     ],
// //     instructions: [
// //       "Divide the ground beef into 4 equal portions and form into patties. Season with salt and pepper.",
// //       "Grill the patties over medium-high heat to your desired doneness.",
// //       "Place a patty on each bun and top with lettuce, tomato, onion, and cheese if using.",
// //       "Serve with ketchup, mustard, and mayonnaise.",
// //     ],
// //   },
// // },
// // {
// //   id: "10",
// //   title: "Curry Salmon Dinner",
// //   imageUrl:
// //     "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   description:
// //     "Rich and creamy curry sauce poured over perfectly cooked salmon fillets, served with rice.",
// //   categories: ["Seafood", "Curry", "Dinner"],
// //   tag: ["Salmon", "Curry"],
// //   recipes: {
// //     ingredients: [
// //       "4 salmon fillets",
// //       "1 tablespoon oil",
// //       "1 onion, chopped",
// //       "2 garlic cloves, minced",
// //       "1 tablespoon curry powder",
// //       "1 can (14 oz) coconut milk",
// //       "1 tablespoon tomato paste",
// //       "Salt and pepper to taste",
// //       "Cooked rice, for serving",
// //     ],
// //     instructions: [
// //       "Season the salmon fillets with salt and pepper.",
// //       "Heat oil in a pan over medium heat. Add the salmon and cook until golden on both sides. Remove from the pan.",
// //       "In the same pan, add onion and garlic, and sauté until soft.",
// //       "Stir in curry powder, coconut milk, and tomato paste. Simmer for 5 minutes.",
// //       "Return the salmon to the pan and coat with the curry sauce. Cook for an additional 5-7 minutes.",
// //       "Serve the salmon with rice and spoon the extra sauce over the top.",
// //     ],
// //   },
// // },
// // {
// //   id: "11",
// //   title: "Steak Dinner",
// //   imageUrl:
// //     "https://images.unsplash.com/photo-1432139509613-5c4255815697?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   description:
// //     "A perfectly seasoned and seared steak, served with a side of garlic mashed potatoes and steamed green beans.",
// //   categories: ["Dinner", "Steakhouse Favorites", "American Cuisine"],
// //   tag: ["Steak", "Beef"],
// //   recipes: {
// //     ingredients: [
// //       "2 ribeye steaks, about 1-inch thick",
// //       "Salt and freshly ground black pepper",
// //       "2 tablespoons olive oil",
// //       "2 tablespoons butter",
// //       "2 cloves garlic, minced",
// //       "For the garlic mashed potatoes:",
// //       "4 large potatoes, peeled and quartered",
// //       "1/4 cup milk",
// //       "2 tablespoons butter",
// //       "2 cloves garlic, minced",
// //       "Salt and pepper to taste",
// //       "For the steamed green beans:",
// //       "1 pound green beans, trimmed",
// //       "Salt and pepper to taste",
// //     ],
// //     instructions: [
// //       "Season steaks with salt and pepper.",
// //       "Heat olive oil in a skillet over medium-high heat. Add steaks and cook until a brown crust forms, about 4-5 minutes per side for medium-rare.",
// //       "Add butter and minced garlic to the skillet, basting the steaks with the melted garlic butter for 1 minute.",
// //       "For the garlic mashed potatoes, boil potatoes until tender. Mash with milk, butter, minced garlic, salt, and pepper.",
// //       "Steam green beans until tender, season with salt and pepper.",
// //       "Serve the steak with garlic mashed potatoes and steamed green beans on the side.",
// //     ],
// //   },
// // },
// // {
// //   id: "12",
// //   title: "Gourmet Hamburger",
// //   imageUrl:
// //     "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=3183&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   description:
// //     "A juicy, gourmet burger made with high-quality beef, topped with gourmet cheese, lettuce, tomatoes, and a secret sauce, served on a toasted brioche bun.",
// //   categories: ["Dinner", "Fast Food Refined", "American Cuisine"],
// //   tag: ["Beef", "Burger"],
// //   recipes: {
// //     ingredients: [
// //       "1 lb ground beef (80/20 blend)",
// //       "Salt and pepper to taste",
// //       "4 brioche buns, halved and toasted",
// //       "4 slices gourmet cheese (e.g., aged cheddar, Gruyere)",
// //       "Lettuce leaves",
// //       "Tomato slices",
// //       "Red onion slices",
// //       "Secret sauce (mix of mayonnaise, ketchup, mustard, and a dash of hot sauce)",
// //     ],
// //     instructions: [
// //       "Divide the ground beef into 4 equal portions and form into patties. Season with salt and pepper.",
// //       "Heat a grill or skillet to medium-high heat. Cook the patties for about 3-4 minutes per side for medium doneness.",
// //       "Place a slice of cheese on each patty during the last minute of cooking to melt.",
// //       "Assemble the burgers on toasted brioche buns with lettuce, tomato, onion, and a generous spread of secret sauce.",
// //       "Serve immediately with a side of fries or a salad.",
// //     ],
// //   },
// // },
// // {
// //   id: "13",
// //   title: "Korean grilled meat dish",
// //   imageUrl:
// //     "https://images.unsplash.com/photo-1550367363-ea12860cc124?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   description:
// //     "A juicy, gourmet burger made with high-quality beef, topped with gourmet cheese, lettuce, tomatoes, and a secret sauce, served on a toasted brioche bun.",
// //   categories: ["Dinner", "Fast Food Refined", "American Cuisine"],
// //   tag: ["Beef", "Steak", "East Asia"],
// //   recipes: {
// //     ingredients: [
// //       "1 lb ground beef (80/20 blend)",
// //       "Salt and pepper to taste",
// //       "4 brioche buns, halved and toasted",
// //       "4 slices gourmet cheese (e.g., aged cheddar, Gruyere)",
// //       "Lettuce leaves",
// //       "Tomato slices",
// //       "Red onion slices",
// //       "Secret sauce (mix of mayonnaise, ketchup, mustard, and a dash of hot sauce)",
// //     ],
// //     instructions: [
// //       "Divide the ground beef into 4 equal portions and form into patties. Season with salt and pepper.",
// //       "Heat a grill or skillet to medium-high heat. Cook the patties for about 3-4 minutes per side for medium doneness.",
// //       "Place a slice of cheese on each patty during the last minute of cooking to melt.",
// //       "Assemble the burgers on toasted brioche buns with lettuce, tomato, onion, and a generous spread of secret sauce.",
// //       "Serve immediately with a side of fries or a salad.",
// //     ],
// //   },
// // },
// // {
// //   id: "14",
// //   title: "Hearty Breakfast",
// //   imageUrl:
// //     "https://images.unsplash.com/photo-1513442542250-854d436a73f2?q=80&w=3114&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   description:
// //     "A juicy, gourmet burger made with high-quality beef, topped with gourmet cheese, lettuce, tomatoes, and a secret sauce, served on a toasted brioche bun.",
// //   categories: ["Breakfast", "Bacon", "American Cuisine"],
// //   tag: ["Bacon", "Eggs", "American"],
// //   recipes: {
// //     ingredients: [
// //       "1 lb ground beef (80/20 blend)",
// //       "Salt and pepper to taste",
// //       "4 brioche buns, halved and toasted",
// //       "4 slices gourmet cheese (e.g., aged cheddar, Gruyere)",
// //       "Lettuce leaves",
// //       "Tomato slices",
// //       "Red onion slices",
// //       "Secret sauce (mix of mayonnaise, ketchup, mustard, and a dash of hot sauce)",
// //     ],
// //     instructions: [
// //       "Divide the ground beef into 4 equal portions and form into patties. Season with salt and pepper.",
// //       "Heat a grill or skillet to medium-high heat. Cook the patties for about 3-4 minutes per side for medium doneness.",
// //       "Place a slice of cheese on each patty during the last minute of cooking to melt.",
// //       "Assemble the burgers on toasted brioche buns with lettuce, tomato, onion, and a generous spread of secret sauce.",
// //       "Serve immediately with a side of fries or a salad.",
// //     ],
// //     },
// //   }
// // ];
