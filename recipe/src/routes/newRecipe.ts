import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  DatabaseConnectionError,
} from "@gogittix/common";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.post(
  "/api/1/recipes/",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Please enter a recipe title"),
    body("description").trim().isLength({ min: 10 }),
    body("imageUrl").not().isEmpty().withMessage("Please provide an image"),
    body("ingredients.*.name").trim().isLength({ min: 2 }),
    body("instructions.*.step").trim().isLength({ min: 5 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("creating a new recipe");
    try {
      const recipes = await prisma.recipe.create({
        data: {
          userId: req.currentUser!.id,
          title: req.body.title,
          description: req.body.description,
          imageUrl: req.body.imageUrl,
          ingredients: req.body.ingredients,
          instructions: req.body.instructions,
        },
      });
      console.log(recipes);
      res.status(201).send({ data: recipes });
    } catch (error) {
      console.log(error);
    }
  }
);

export { router as newRecipesRouter };
