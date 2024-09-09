import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import { recipeRoutes } from "./routes/recipeRoutes";
import { config } from "./config";

const app = express();

app.set("trust proxy", 1); //trust traffic coming from ingress-nginx

app.use(express.json()); // express.json() is a middleware that parses incoming requests with JSON payloads
app.use(helmet());

app.use(
  cookieSession({
    signed: false,
    secure: config.isProduction, // Reference the config module for environment check
  })
);

app.use(recipeRoutes);

export { app };
