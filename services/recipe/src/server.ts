import dotenv from "dotenv";
import "reflect-metadata"; // Ensure it is imported first
import app from "./app";
import { consumeIngredient } from "./utils/consumeIngredient";
import { consumeUser } from "./utils/consumeUser";

dotenv.config();

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await consumeIngredient();
      await consumeUser();

      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start the server:", error);
    }
  })();
}

export default app; // ✅ Export app for Jest to use
