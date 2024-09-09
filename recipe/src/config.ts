import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Validate environment variables and provide default values where necessary
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined");
}

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  isProduction: process.env.NODE_ENV === "production",
};
