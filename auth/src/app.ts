import express from "express";
import "express-async-errors"; //for catching errors in async routes
import { json } from "body-parser";
import { errorHandler, NotFoundError } from "@gogittix/common";

import cookieSession from "cookie-session";
import { signupRouter } from "./routes/signup";

const app = express();

app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(signupRouter);

app.use(errorHandler);

export { app };
