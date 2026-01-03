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
exports.consumeIngredient = consumeIngredient;
const rabbitmq_broker_1 = require("@anchordiv/rabbitmq-broker");
const recipe_ingredient_service_1 = __importDefault(require("../services/recipe.ingredient.service"));
function consumeIngredient() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Initializing Ingredient Message Queue Manager...");
        // RabbitMQ broker instance
        const broker = rabbitmq_broker_1.RabbitMQBroker.getInstance();
        // Initialize the RabbitMQ connection
        yield broker.init(process.env.RABBITMQ_URL);
        // Queue configuration for ingredient service
        const ingredientQueueConfig = {
            exchange: "recipe.ingredients.inventory-updates",
            mainQueue: "ingredient-create-queue",
            dlx: "recipe.ingredients.dlx",
            dlq: "ingredient-create-dlq",
            routingKey: "recipe.ingredients.create.ingredient",
        };
        // Create a high-level MessageQueueManager instance
        const ingredientManager = broker.createMessageQueueManager(ingredientQueueConfig);
        // Initialize queues and bindings
        yield ingredientManager.initialize();
        // Process Dead Letter Queue (DLQ) Messages
        yield ingredientManager.processDLQ((msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log("[DLQ] Handling dead-lettered ingredient message:", data);
                // Process dead-lettered ingredient message
                yield recipe_ingredient_service_1.default.handleDeadLetter(data);
                // Broker will handle acknowledgment automatically
            }
            catch (error) {
                console.error("[DLQ] Error processing ingredient message:", error);
                // Let the broker handle negative acknowledgment or requeue
                throw error; // Pass the error for broker to decide requeue logic
            }
        }));
        // Process Main Queue Messages
        yield ingredientManager.processMainQueue((msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log("[Main Queue] Caching ingredient data:", data);
                // Cache ingredient data using the service
                yield recipe_ingredient_service_1.default.cacheIngredient(data);
                // Broker will handle acknowledgment automatically
            }
            catch (error) {
                console.error("[Main Queue] Error processing ingredient message:", error);
                // Let the broker handle negative acknowledgment or requeue
                throw error; // Pass the error for broker to decide requeue logic
            }
        }));
        console.log("Ingredient Message Queue Manager initialized.");
    });
}
