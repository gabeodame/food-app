import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { json } from "body-parser";
import { allRecipesRouter } from "./routes/allRecipes";
import { recipeDetailsRouter } from "./routes/recipeDetails";
import { newRecipesRouter } from "./routes/newRecipe";

// import cors from "cors";

const app = express();

app.set("trust proxy", true); //trust traffic coming from ingress-ngnix

app.use(express.json()); // express.json() is a middleware that parses incoming requests with JSON payloads
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  })
);

// app.use(cors);

app.use(allRecipesRouter);
app.use(recipeDetailsRouter);
app.use(newRecipesRouter);

export { app };
