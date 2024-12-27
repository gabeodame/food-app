import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import { errorHandler, NotFoundError } from "@gogittix/common";
import { recipeRoutes } from "./routes/recipeRoutes";

// Initialize the express app
const app = express();

app.set("trust proxy", 1); //trust traffic coming from ingress-nginx

app.use(express.json()); // express.json() is a middleware that parses incoming requests with JSON payloads
app.use(
  helmet({
    contentSecurityPolicy: false, // CSP can block resources
  })
);

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production", // Secure in production
  })
);

app.use(recipeRoutes);

// Catch all route handler
app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

// Error handling middleware
app.use(errorHandler);

export { app }; // Export the app for use in index.js
