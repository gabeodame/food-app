import "reflect-metadata"; // Ensure it is imported first
import app from "./app";
import dotenv from "dotenv";

import recipeIngredientService from "./services/recipe.ingredient.service";
import { RabbitMQBroker } from "@anchordiv/rabbitmq-broker";

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const broker = RabbitMQBroker.getInstance();
    await broker.init(process.env.RABBITMQ_URL!);

    const exchange = "recipe.ingredients.inventory-updates";
    const mainQueue = "ingredient-create-queue";
    const dlx = "recipe.ingredients.dlx";
    const dlq = "ingredient-create-dlq";
    const routingKey = "recipe.ingredients.create.ingredient";

    // Step 1: Set up the Dead Letter Queue (DLQ)
    await broker.setupDeadLetterQueue(mainQueue, dlx, dlq);

    // Step 2: Assert the main exchange
    await broker.assertExchange(exchange, "topic");

    // Step 3: Set up the main queue and bind it to the exchange
    await broker.setupQueue(mainQueue, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": dlx, // Connect the main queue to the DLX
      },
    });
    await broker.bindQueue(mainQueue, exchange, routingKey);

    console.log(`RabbitMQ setup complete for queues and exchange.`);

    // Step 4: Consume messages from the DLQ
    await broker.consume(dlq, async (msg) => {
      if (!msg) return;
      try {
        const data = JSON.parse(msg.content.toString());
        console.log("[DLQ] Processing message:", data);

        // Handle dead-lettered messages
        await recipeIngredientService.handleDeadLetter(data);

        console.log("[DLQ] Message processed successfully.");
        // broker.ack(msg);
      } catch (error) {
        console.error("[DLQ] Error processing message:", error);
        // broker.nack(msg, false, false); // Discard message
      }
    });

    // Step 5: Consume messages from the main queue
    await broker.consume(mainQueue, async (msg) => {
      if (!msg) return;
      try {
        const data = JSON.parse(msg.content.toString());
        console.log("[Main Queue] Received message:", data);

        // Handle valid ingredient messages
        await recipeIngredientService.cacheIngredient(data);

        console.log("[Main Queue] Message processed successfully.");
        //   broker.ack(msg);
      } catch (error) {
        console.error("[Main Queue] Error processing message:", error);
        // broker.nack(msg, false, true); // Requeue the message
      }
    });

    // Step 6: Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
})();
