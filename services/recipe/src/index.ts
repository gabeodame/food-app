import { app } from "./app";
import { loadConfig } from "./config"; // Import the async config loader
import { RabbitMQBroker } from "@anchordiv/rabbitmq-broker";

const start = async () => {
  console.log("Starting Recipe Service...");

  try {
    // Initialize RabbitMQ broker
    const broker = RabbitMQBroker.getInstance();
    await broker.init(process.env.RABBITMQ_URL!);
    console.log("RabbitMQ broker initialized.");

    const exchange = "recipe.ingredients.inventory-updates";
    const mainQueue = "ingredient-create-queue";
    const dlx = "recipe.ingredients.dlx";
    const dlq = "ingredient-create-dlq";
    const routingKey = "recipe.ingredients.create.ingredient";
    const updateRecipeRoutingKey = "recipe.ingredients.update.ingredient";

    // Setup Dead Letter Queue (DLQ)
    await broker.setupDeadLetterQueue(mainQueue, dlx, dlq);
    console.log(`Dead letter queue (${dlq}) setup complete.`);

    // Process dead-lettered messages
    await broker.consume(dlq, async (message) => {
      console.log(`[DLQ] Received message: ${message.content.toString()}`);
      try {
        // Handle the dead-lettered message

        console.log("[DLQ] Processing dead-lettered message...");
      } catch (error) {
        console.error("[DLQ] Error processing message:", error);
        // Optionally alert or log the incident
      }
    });

    // Bind Main Queue to Exchange
    await broker.assertExchange(exchange, "topic");
    await broker.bindQueue(mainQueue, exchange, routingKey);
    console.log(
      `Queue (${mainQueue}) bound to exchange (${exchange}) with routing key (${routingKey}).`
    );

    // Consume messages from the main queue
    await broker.consume(mainQueue, async (message) => {
      console.log(
        `[Main Queue] Received message: ${message.content.toString()}`
      );
      try {
        // Perform some action on the message
        // Example: Create or update an ingredient

        console.log("[Main Queue] Processing message...");
      } catch (error) {
        console.error("[Main Queue] Error processing message:", error);
        // Optionally send to DLQ or log error
      }
    });

    // Load configuration (including secrets like database URL)
    const config = await loadConfig();
    console.log("Configuration loaded successfully.");

    // Start the HTTP server
    app.listen(config.port, () => {
      console.log(`Connected to database at: ${config.databaseUrl}`);
      console.log(`Recipe service is now listening on port ${config.port}!`);
    });
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1); // Exit with a failure code to signal issues
  }
};

// Execute the startup function
start();
