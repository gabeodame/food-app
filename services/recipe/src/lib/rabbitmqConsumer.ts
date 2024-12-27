// import { consumeMessages, setupRabbitMQ } from "@anchordiv/broker";

// export async function initializeRabbitMQConsumers(): Promise<void> {
//   try {
//     await setupRabbitMQ();
//     await consumeMessages("user-created", processUserCreated);
//     console.log("RabbitMQ consumers initialized.");
//   } catch (error) {
//     console.error("Error initializing RabbitMQ consumers:", error);
//     process.exit(1);
//   }
// }

// function processUserCreated(data: any) {
//   console.log("Processing user-created message:", data);
//   // Add business logic here
// }
