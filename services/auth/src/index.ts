import mongoose from "mongoose";
import { app } from "./app";
import { config } from "./config";

const start = async () => {
  try {
    await mongoose.connect(config.mongoUri, {});

    app.listen(config.port, () => {
    });
  } catch (err) {
    console.error(err);
  }
};

start();
