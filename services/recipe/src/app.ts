import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import recipeRoutes from "./routes/recipe.routes";
import { currentUser, errorHandler } from "@gogittix/common";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "development",
  })
);

app.use(currentUser);

// Swagger Documentation
app.use(
  "/api/1/recipes/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Routes
app.use("/api/1/recipes", recipeRoutes);

// Error Handler Middleware
app.use(errorHandler);

export default app;
