import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import recipeRoutes from "./routes/recipe.routes";
import { errorHandler } from "@gogittix/common";

const app = express();

app.use(express.json());

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
