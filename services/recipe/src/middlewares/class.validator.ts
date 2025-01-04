import { body } from "express-validator";

// Validation rules for creating a recipe
export const validateCreateRecipe = [
  body("title").notEmpty().withMessage("Please enter a recipe title"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("imageUrl").notEmpty().withMessage("Please provide an image"),
  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Ingredients are required"),
  body("ingredients.*.name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Ingredient name must be at least 2 characters"),
  body("instructions")
    .isArray({ min: 1 })
    .withMessage("Instructions are required"),
  body("instructions.*.step")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Instruction step must be at least 5 characters"),
];

export const validateUpdateRecipe = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  // Add more validation rules as needed
];
