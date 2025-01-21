import { RabbitMQBroker, Message } from "@anchordiv/rabbitmq-broker";

interface QueueConfig {
  exchange: string;
  mainQueue: string;
  dlx: string;
  dlq: string;
  routingKey: string;
}

class MessageQueueManager {
  private broker: RabbitMQBroker;
  private exchange: string;
  private mainQueue: string;
  private dlx: string;
  private dlq: string;
  private routingKey: string;

  constructor(config: QueueConfig) {
    this.broker = RabbitMQBroker.getInstance();
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
  async initialize(connectionUrl: string): Promise<void> {
    await this.broker.init(connectionUrl);
    console.log("RabbitMQ broker initialized.");
    await this.setupQueues();
  }

  /**
   * Setup queues, exchange, and bindings
   */
  private async setupQueues(): Promise<void> {
    try {
      // Setup Dead Letter Queue (DLQ)
      await this.broker.setupDeadLetterQueue(
        this.mainQueue,
        this.dlx,
        this.dlq
      );
      console.log(`Dead letter queue (${this.dlq}) setup complete.`);

      // Assert exchange
      await this.broker.assertExchange(this.exchange, "topic", {
        durable: true,
      });
      console.log(`Exchange (${this.exchange}) asserted.`);

      // Setup and bind main queue
      await this.broker.setupQueue(this.mainQueue, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": this.dlx, // Bind main queue to DLX
        },
      });
      await this.broker.bindQueue(
        this.mainQueue,
        this.exchange,
        this.routingKey
      );
      console.log(
        `Queue (${this.mainQueue}) bound to exchange (${this.exchange}) with routing key (${this.routingKey}).`
      );
    } catch (error) {
      console.error("Error setting up queues:", error);
      throw error;
    }
  }

  /**
   * Consume messages from Dead Letter Queue (DLQ)
   * @param handler Callback to process messages
   */
  async processDLQ(handler: (data: any) => Promise<void>): Promise<void> {
    await this.broker.consume(this.dlq, async (msg) => {
      if (!msg) return;
      try {
        const data = JSON.parse(msg.content.toString());
        console.log(`[DLQ] Received message: ${data}`);
        await handler(data);
        // this.broker.ack(msg); // Acknowledge the message
      } catch (error) {
        console.error("[DLQ] Error processing message:", error);
        // this.broker.nack(msg, false, false); // Discard message
      }
    });
  }

  /**
   * Consume messages from Main Queue
   * @param handler Callback to process messages
   */
  async processMainQueue(handler: (data: any) => Promise<void>): Promise<void> {
    await this.broker.consume(this.mainQueue, async (msg) => {
      if (!msg) return;
      try {
        const data = JSON.parse(msg.content.toString());
        // console.log(`[Main Queue] Received message: ${data}`);
        await handler(data);
        // this.broker.ack(msg); // Acknowledge the message
      } catch (error) {
        console.error("[Main Queue] Error processing message:", error);
        // this.broker.nack(msg, false, true); // Requeue the message
      }
    });
  }
}

export default MessageQueueManager;
