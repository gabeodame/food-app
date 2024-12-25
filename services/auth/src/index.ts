import mongoose from "mongoose";
import { app } from "./app";
import { config } from "./config";

const start = async () => {
  try {
    await mongoose.connect(config.mongoUri, {});
    console.log("Connected to MongoDB");

    app.listen(config.port, () => {
      console.log(`Auth service listening on port ${config.port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
