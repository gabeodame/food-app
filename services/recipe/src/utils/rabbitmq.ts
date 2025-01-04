import { RabbitMQBroker } from "@anchordiv/rabbitmq-broker";

class MessageQueueManager {
  private broker: RabbitMQBroker;
  private exchange: string;
  private mainQueue: string;
  private dlx: string;
  private dlq: string;
  private routingKey: string;

  constructor(config: {
    exchange: string;
    mainQueue: string;
    dlx: string;
    dlq: string;
    routingKey: string;
  }) {
    this.broker = RabbitMQBroker.getInstance();
    this.exchange = config.exchange;
    this.mainQueue = config.mainQueue;
    this.dlx = config.dlx;
    this.dlq = config.dlq;
    this.routingKey = config.routingKey;
  }

  async initialize(connectionUrl: string): Promise<void> {
    await this.broker.init(connectionUrl);
    console.log("RabbitMQ broker initialized.");
    await this.setupQueues();
  }

  private async setupQueues(): Promise<void> {
    // Setup Dead Letter Queue (DLQ)
    await this.broker.setupDeadLetterQueue(this.mainQueue, this.dlx, this.dlq);
    console.log(`Dead letter queue (${this.dlq}) setup complete.`);

    // Bind Main Queue to Exchange
    await this.broker.assertExchange(this.exchange, "topic");
    await this.broker.bindQueue(this.mainQueue, this.exchange, this.routingKey);
    console.log(
      `Queue (${this.mainQueue}) bound to exchange (${this.exchange}) with routing key (${this.routingKey}).`
    );
  }

  async processDLQ(handler: (message: any) => Promise<void>): Promise<void> {
    await this.broker.consume(this.dlq, async (message) => {
      console.log(`[DLQ] Received message: ${message.content.toString()}`);
      try {
        await handler(message);
        console.log("[DLQ] Processing dead-lettered message...");
      } catch (error) {
        console.error("[DLQ] Error processing message:", error);
      }
    });
  }

  async processMainQueue(
    handler: (message: any) => Promise<void>
  ): Promise<void> {
    await this.broker.consume(this.mainQueue, async (message) => {
      console.log(
        `[Main Queue] Received message: ${message.content.toString()}`
      );
      try {
        await handler(message);
        console.log("[Main Queue] Processing message...");
      } catch (error) {
        console.error("[Main Queue] Error processing message:", error);
      }
    });
  }
}

export default MessageQueueManager;
