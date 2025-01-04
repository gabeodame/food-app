import app from "./app";
import MessageQueueManager from "./utils/rabbitmq";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Initialize RabbitMQ connection
    const mqManager = new MessageQueueManager({
      exchange: "recipe.ingredients.inventory-updates",
      mainQueue: "ingredient-create-queue",
      dlx: "recipe.ingredients.dlx",
      dlq: "ingredient-create-dlq",
      routingKey: "recipe.ingredients.create.ingredient",
    });

    await mqManager.initialize(process.env.RABBITMQ_URL!);

    // Start consuming messages from DLQ
    await mqManager.processDLQ(async (message) => {
      console.log("[DLQ] Processing message:", message.content.toString());
    });

    // Start consuming messages from main queue
    await mqManager.processMainQueue(async (message) => {
      console.log("Received message:", message.content.toString());
    });

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
})();
