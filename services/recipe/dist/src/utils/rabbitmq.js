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
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_broker_1 = require("@anchordiv/rabbitmq-broker");
class MessageQueueManager {
    constructor(config) {
        this.broker = rabbitmq_broker_1.RabbitMQBroker.getInstance();
        this.exchange = config.exchange;
        this.mainQueue = config.mainQueue;
        this.dlx = config.dlx;
        this.dlq = config.dlq;
        this.routingKey = config.routingKey;
    }
    /**
     * Initialize RabbitMQ connection and queues
     * @param connectionUrl RabbitMQ connection URL
     */
    initialize(connectionUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.broker.init(connectionUrl);
            console.log("RabbitMQ broker initialized.");
            yield this.setupQueues();
        });
    }
    /**
     * Setup queues, exchange, and bindings
     */
    setupQueues() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Setup Dead Letter Queue (DLQ)
                yield this.broker.setupDeadLetterQueue(this.mainQueue, this.dlx, this.dlq);
                console.log(`Dead letter queue (${this.dlq}) setup complete.`);
                // Assert exchange
                yield this.broker.assertExchange(this.exchange, "topic", {
                    durable: true,
                });
                console.log(`Exchange (${this.exchange}) asserted.`);
                // Setup and bind main queue
                yield this.broker.setupQueue(this.mainQueue, {
                    durable: true,
                    arguments: {
                        "x-dead-letter-exchange": this.dlx, // Bind main queue to DLX
                    },
                });
                yield this.broker.bindQueue(this.mainQueue, this.exchange, this.routingKey);
                console.log(`Queue (${this.mainQueue}) bound to exchange (${this.exchange}) with routing key (${this.routingKey}).`);
            }
            catch (error) {
                console.error("Error setting up queues:", error);
                throw error;
            }
        });
    }
    /**
     * Consume messages from Dead Letter Queue (DLQ)
     * @param handler Callback to process messages
     */
    processDLQ(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.broker.consume(this.dlq, (msg) => __awaiter(this, void 0, void 0, function* () {
                if (!msg)
                    return;
                try {
                    const data = JSON.parse(msg.content.toString());
                    console.log(`[DLQ] Received message: ${data}`);
                    yield handler(data);
                    // this.broker.ack(msg); // Acknowledge the message
                }
                catch (error) {
                    console.error("[DLQ] Error processing message:", error);
                    // this.broker.nack(msg, false, false); // Discard message
                }
            }));
        });
    }
    /**
     * Consume messages from Main Queue
     * @param handler Callback to process messages
     */
    processMainQueue(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.broker.consume(this.mainQueue, (msg) => __awaiter(this, void 0, void 0, function* () {
                if (!msg)
                    return;
                try {
                    const data = JSON.parse(msg.content.toString());
                    // console.log(`[Main Queue] Received message: ${data}`);
                    yield handler(data);
                    // this.broker.ack(msg); // Acknowledge the message
                }
                catch (error) {
                    console.error("[Main Queue] Error processing message:", error);
                    // this.broker.nack(msg, false, true); // Requeue the message
                }
            }));
        });
    }
}
exports.default = MessageQueueManager;
