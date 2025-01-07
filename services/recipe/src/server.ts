import "reflect-metadata"; // ensure to import it first
import app from "./app";
import MessageQueueManager from "./utils/rabbitmq";
import dotenv from "dotenv";
import recipeUserService from "./services/recipe.user.service";
import recipeService from "./services/recipe.service";

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Initialize RabbitMQ connection for Ingredient Service
    const ingredientQueueManager = new MessageQueueManager({
      exchange: "recipe.ingredients.inventory-updates",
      mainQueue: "ingredient-create-queue",
      dlx: "recipe.ingredients.dlx",
      dlq: "ingredient-create-dlq",
      routingKey: "recipe.ingredients.create.ingredient",
    });

    await ingredientQueueManager.initialize(process.env.RABBITMQ_URL!);

    // Start consuming messages from Ingredient DLQ
    await ingredientQueueManager.processDLQ(async (message) => {
      console.log(
        "[Ingredient DLQ] Processing message:",
        message.content.toString()
      );
      // Add logic to handle dead-letter messages here
    });

    // Start consuming messages from Ingredient main queue
    await ingredientQueueManager.processMainQueue(async (message) => {
      console.log(
        "[Ingredient Queue] Received message:",
        message.content.toString()
      );
      // Add logic to handle main queue messages here
      const data = JSON.parse(message.content.toString());
      recipeService.createRecipe(data);
    });

    // Initialize RabbitMQ connection for Auth Service
    const authQueueManager = new MessageQueueManager({
      exchange: "recipe.users.profile-updates",
      mainQueue: "recipe-user-signup-queue",
      dlx: "recipe-users-dlx",
      dlq: "recipe-user-signup-dlq",
      routingKey: "users.signup.new-user",
    });

    await authQueueManager.initialize(process.env.RABBITMQ_URL!);

    // Start consuming messages from Auth DLQ
    await authQueueManager.processDLQ(async (message) => {
      console.log("[Auth DLQ] Processing message:", message.content.toString());
      // Add logic to handle dead-letter messages here
    });

    // Start consuming messages from Auth main queue
    await authQueueManager.processMainQueue(async (message) => {
      console.log("[Auth Queue] Received message:", message.content.toString());
      // Add logic to handle main queue messages here
      const data = JSON.parse(message.content.toString());
      await recipeUserService.createUser(data);
    });

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
})();
