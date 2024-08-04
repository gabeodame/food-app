import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.get("/api/1/recipes/:id", async (req: Request, res: Response) => {
  console.log(req.params);
  const id = +req.params?.id;
  const recipe = await prisma.recipe.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      ingredients: true,
      instructions: true,
      tags: {
        include: {
          tag: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
  console.log(recipe);
  res.status(200).send({ data: recipe });
});

export { router as recipeDetailsRouter };
