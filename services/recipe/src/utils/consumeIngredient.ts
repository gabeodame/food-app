import { RabbitMQBroker } from "@anchordiv/rabbitmq-broker";
import recipeIngredientService from "../services/recipe.ingredient.service";

export async function consumeIngredient() {
  console.log("Initializing Ingredient Message Queue Manager...");

  // RabbitMQ broker instance
  const broker = RabbitMQBroker.getInstance();

  // Initialize the RabbitMQ connection
  await broker.init(process.env.RABBITMQ_URL!);

  // Queue configuration for ingredient service
  const ingredientQueueConfig = {
    exchange: "recipe.ingredients.inventory-updates",
    mainQueue: "ingredient-create-queue",
    dlx: "recipe.ingredients.dlx",
    dlq: "ingredient-create-dlq",
    routingKey: "recipe.ingredients.create.ingredient",
  };

  // Create a high-level MessageQueueManager instance
  const ingredientManager = broker.createMessageQueueManager(
    ingredientQueueConfig
  );

  // Initialize queues and bindings
  await ingredientManager.initialize();

  // Process Dead Letter Queue (DLQ) Messages
  await ingredientManager.processDLQ(async (msg) => {
    try {
      const data = JSON.parse(msg.content.toString());
      console.log("[DLQ] Handling dead-lettered ingredient message:", data);

      // Process dead-lettered ingredient message
      await recipeIngredientService.handleDeadLetter(data);

      // Broker will handle acknowledgment automatically
    } catch (error) {
      console.error("[DLQ] Error processing ingredient message:", error);

      // Let the broker handle negative acknowledgment or requeue
      throw error; // Pass the error for broker to decide requeue logic
    }
  });

  // Process Main Queue Messages
  await ingredientManager.processMainQueue(async (msg) => {
    try {
      const data = JSON.parse(msg.content.toString());
      console.log("[Main Queue] Caching ingredient data:", data);

      // Cache ingredient data using the service
      await recipeIngredientService.cacheIngredient(data);

      // Broker will handle acknowledgment automatically
    } catch (error) {
      console.error("[Main Queue] Error processing ingredient message:", error);

      // Let the broker handle negative acknowledgment or requeue
      throw error; // Pass the error for broker to decide requeue logic
    }
  });

  console.log("Ingredient Message Queue Manager initialized.");
}
