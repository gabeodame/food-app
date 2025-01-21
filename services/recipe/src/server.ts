import dotenv from "dotenv";
import "reflect-metadata"; // Ensure it is imported first
import app from "./app";

import { RabbitMQBroker } from "@anchordiv/rabbitmq-broker";
import { consumeIngredient } from "./utils/consumeIngredient";
import { consumeUser } from "./utils/consumeUser";

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // const broker = RabbitMQBroker.getInstance();
    // await broker.init(process.env.RABBITMQ_URL!);

    await consumeIngredient();

    await consumeUser();

    // Step 6: Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
})();
