import express from "express";
import cookieSession from "cookie-session";
import { authRoutes } from "./routes/authRoutes";
import { errorHandler, NotFoundError, currentUser } from "@gogittix/common"; // Adjust paths

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// Use authentication routes
app.use(authRoutes);

// Catch-all for undefined routes
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
