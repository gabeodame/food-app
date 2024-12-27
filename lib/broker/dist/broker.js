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
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQBroker {
    constructor() {
        this.connection = null;
        this.channel = null;
    }
    /**
     * Gets the singleton instance of the RabbitMQBroker.
     */
    static getInstance() {
        if (!RabbitMQBroker.instance) {
            RabbitMQBroker.instance = new RabbitMQBroker();
        }
        return RabbitMQBroker.instance;
    }
    /**
     * Initializes the connection and channel to RabbitMQ.
     * @param url - The RabbitMQ connection URL.
     */
    init(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!url) {
                throw new Error("RabbitMQ connection URL is undefined.");
            }
            // Trim the URL to remove any unwanted whitespace or line breaks
            const sanitizedUrl = url.trim();
            console.log("Connecting to RabbitMQ with sanitized URL:", sanitizedUrl);
            try {
                this.connection = yield amqplib_1.default.connect(sanitizedUrl);
                this.channel = yield this.connection.createChannel();
                console.log("RabbitMQ connection and channel established.");
            }
            catch (err) {
                console.error("Failed to connect to RabbitMQ:", {
                    url: sanitizedUrl,
                    error: err.message,
                    stack: err.stack,
                });
                throw err;
            }
        });
    }
    /**
     * Publishes a message to a specified queue.
     * @param queue - The queue name.
     * @param message - The message to publish.
     */
    publish(queue, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error("RabbitMQ channel is not initialized. Call init() first.");
            }
            try {
                yield this.channel.assertQueue(queue, { durable: true });
                this.channel.sendToQueue(queue, Buffer.isBuffer(message) ? message : Buffer.from(message));
                console.log(`Message published to queue: ${queue}`);
            }
            catch (err) {
                console.error("Failed to publish message:", err);
                throw err;
            }
        });
    }
    /**
     * Consumes messages from a specified queue.
     * @param queue - The queue name.
     * @param onMessage - Callback to handle incoming messages.
     */
    consume(queue, onMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error("RabbitMQ channel is not initialized. Call init() first.");
            }
            try {
                yield this.channel.assertQueue(queue, { durable: true });
                yield this.channel.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                    if (msg !== null) {
                        try {
                            yield onMessage(msg);
                            this.channel.ack(msg);
                        }
                        catch (err) {
                            console.error("Message handling failed, requeueing message:", err);
                            this.channel.nack(msg, false, true); // Requeue message
                        }
                    }
                }));
                console.log(`Consumer set up for queue: ${queue}`);
            }
            catch (err) {
                console.error("Failed to set up consumer:", err);
                throw err;
            }
        });
    }
    /**
     * Closes the RabbitMQ connection and channel.
     */
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.channel) {
                    yield this.channel.close();
                    this.channel = null;
                }
                if (this.connection) {
                    yield this.connection.close();
                    this.connection = null;
                }
                console.log("RabbitMQ connection closed.");
            }
            catch (err) {
                console.error("Error while closing RabbitMQ connection:", err);
            }
        });
    }
}
exports.default = RabbitMQBroker; // Ensure this is the default export
