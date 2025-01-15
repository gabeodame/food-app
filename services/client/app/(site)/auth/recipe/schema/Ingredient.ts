import { z } from "zod";

export const IngredientSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  category: z
    .string()
    .min(3, { message: "Category must be at least 3 characters long" }),
  unit: z
    .string()
    .min(1, { message: "Unit must be at least 1 character long" }),
  calories: z.number().optional(),
  protein: z.number().optional(),
  fat: z.number().optional(),
  carbohydrates: z.number().optional(),
  allergens: z.array(z.string()).optional(),
});
