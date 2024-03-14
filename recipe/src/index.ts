import { app } from "./app";
import dotenv from "dotenv";
dotenv.config();

const start = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be defined");
  }
  app.listen(3000, () => {
    console.log(process.env.DATABASE_URL);
    console.log("recipe service is now listening on port 3000!");
  });
};

start();
