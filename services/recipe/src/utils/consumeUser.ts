import { RabbitMQBroker } from "@anchordiv/rabbitmq-broker";
import userService from "../services/recipe.user.service";

export async function consumeUser() {
  // Get the RabbitMQ broker instance
  const broker = RabbitMQBroker.getInstance();

  // Initialize the RabbitMQ connection
  await broker.init(process.env.RABBITMQ_URL!);

  // Define the queue configuration for user consumption
  const userQueueConfig = {
    exchange: "recipe.users.profile-updates", // Shared exchange
    mainQueue: "recipe-user-signup-queue", // Unique queue for the recipe service
    dlx: "recipe-users-dlx", // Unique DLX
    dlq: "recipe-user-signup-dlq", // Unique DLQ
    routingKey: "users.signup.new-user", // Shared routing key
  };

  // Create a high-level MessageQueueManager instance
  const userManager = broker.createMessageQueueManager(userQueueConfig);

  // Initialize queues and bindings
  await userManager.initialize();

  // Process Dead Letter Queue (DLQ) Messages
  await userManager.processDLQ(async (msg, channel) => {
    try {
      const data = JSON.parse(msg.content.toString());
      console.log("[DLQ] Handling dead-lettered user message:", data);

      // Handle dead-lettered message logic in the service
      await userService.handleDeadLetter(data);

      // Acknowledge the message on successful processing
      //   channel.ack(msg);
    } catch (error) {
      console.error("[DLQ] Failed to process message:", error);
      // Optionally nack or requeue the message
      //   channel.nack(msg, false, false); // Do not requeue in this case
    }
  });

  // Process Main Queue Messages
  await userManager.processMainQueue(async (msg, channel) => {
    try {
      const data = JSON.parse(msg.content.toString());
      console.log("[Main Queue] Creating user:", data);

      // Handle user creation in the service
      await userService.createUser(data);

      // Acknowledge the message on successful processing
      //   channel.ack(msg);
    } catch (error) {
      console.error("[Main Queue] Failed to process message:", error);
      // Requeue the message for further retries
      //   channel.nack(msg, false, true);
    }
  });

  console.log("User Message Queue Manager initialized.");
}
