"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeUser = consumeUser;
const rabbitmq_broker_1 = require("@anchordiv/rabbitmq-broker");
const recipe_user_service_1 = __importDefault(require("../services/recipe.user.service"));
function consumeUser() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the RabbitMQ broker instance
        const broker = rabbitmq_broker_1.RabbitMQBroker.getInstance();
        // Initialize the RabbitMQ connection
        yield broker.init(process.env.RABBITMQ_URL);
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
        yield userManager.initialize();
        // Process Dead Letter Queue (DLQ) Messages
        yield userManager.processDLQ((msg, channel) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log("[DLQ] Handling dead-lettered user message:", data);
                // Handle dead-lettered message logic in the service
                yield recipe_user_service_1.default.handleDeadLetter(data);
                // Acknowledge the message on successful processing
                //   channel.ack(msg);
            }
            catch (error) {
                console.error("[DLQ] Failed to process message:", error);
                // Optionally nack or requeue the message
                //   channel.nack(msg, false, false); // Do not requeue in this case
            }
        }));
        // Process Main Queue Messages
        yield userManager.processMainQueue((msg, channel) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log("[Main Queue] Creating user:", data);
                // Handle user creation in the service
                yield recipe_user_service_1.default.createUser(data);
                // Acknowledge the message on successful processing
                //   channel.ack(msg);
            }
            catch (error) {
                console.error("[Main Queue] Failed to process message:", error);
                // Requeue the message for further retries
                //   channel.nack(msg, false, true);
            }
        }));
        console.log("User Message Queue Manager initialized.");
    });
}
