import mongoose from "mongoose";
import { app } from "./app";
import dotenv from "dotenv";
dotenv.config();

const start = async () => {
  console.log(process.env.JWT_KEY);
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {});
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log("listening on port 3000!");
  });
};

start();
