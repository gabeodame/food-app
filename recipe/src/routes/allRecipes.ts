import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.get("/api/1/recipes", async (req: Request, res: Response) => {
  console.log("Fetching all recipes");
  const recipes = await prisma.recipe.findMany();
  console.log(recipes);
  res.status(200).send({ data: recipes });
});

export { router as allRecipesRouter };
