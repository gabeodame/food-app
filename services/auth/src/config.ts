import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Validate environment variables
if (!process.env.JWT_KEY) {
  throw new Error("JWT_KEY must be defined");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be defined");
}

export const config = {
  port: process.env.PORT || 3000, // Default to port 3000 if not provided
  jwtKey: process.env.JWT_KEY!, // Assert that JWT_KEY is a string
  mongoUri: process.env.MONGO_URI!, // Assert that MONGO_URI is a string
  nodeEnv: process.env.NODE_ENV || "development",
};
