import amqp, { Connection, Channel, Message } from "amqplib";

class RabbitMQBroker {
  private static instance: RabbitMQBroker;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  /**
   * Gets the singleton instance of the RabbitMQBroker.
   */
  public static getInstance(): RabbitMQBroker {
    if (!RabbitMQBroker.instance) {
      RabbitMQBroker.instance = new RabbitMQBroker();
    }
    return RabbitMQBroker.instance;
  }

  /**
   * Initializes the connection and channel to RabbitMQ.
   * @param url - The RabbitMQ connection URL.
   */
  public async init(url: string): Promise<void> {
    if (!url) {
      throw new Error("RabbitMQ connection URL is undefined.");
    }

    // Trim the URL to remove any unwanted whitespace or line breaks
    const sanitizedUrl = url.trim();
    console.log("Connecting to RabbitMQ with sanitized URL:", sanitizedUrl);

    try {
      this.connection = await amqp.connect(sanitizedUrl);
      this.channel = await this.connection.createChannel();
      console.log("RabbitMQ connection and channel established.");
    } catch (err) {
      console.error("Failed to connect to RabbitMQ:", {
        url: sanitizedUrl,
        error: (err as Error).message,
        stack: (err as Error).stack,
      });
      throw err;
    }
  }

  /**
   * Publishes a message to a specified queue.
   * @param queue - The queue name.
   * @param message - The message to publish.
   */
  public async publish(queue: string, message: Buffer | string): Promise<void> {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel is not initialized. Call init() first."
      );
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(
        queue,
        Buffer.isBuffer(message) ? message : Buffer.from(message)
      );
      console.log(`Message published to queue: ${queue}`);
    } catch (err) {
      console.error("Failed to publish message:", err);
      throw err;
    }
  }

  /**
   * Consumes messages from a specified queue.
   * @param queue - The queue name.
   * @param onMessage - Callback to handle incoming messages.
   */
  public async consume(
    queue: string,
    onMessage: (msg: Message) => Promise<void>
  ): Promise<void> {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel is not initialized. Call init() first."
      );
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            await onMessage(msg);
            this.channel!.ack(msg);
          } catch (err) {
            console.error("Message handling failed, requeueing message:", err);
            this.channel!.nack(msg, false, true); // Requeue message
          }
        }
      });

      console.log(`Consumer set up for queue: ${queue}`);
    } catch (err) {
      console.error("Failed to set up consumer:", err);
      throw err;
    }
  }

  /**
   * Closes the RabbitMQ connection and channel.
   */
  public async closeConnection(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      console.log("RabbitMQ connection closed.");
    } catch (err) {
      console.error("Error while closing RabbitMQ connection:", err);
    }
  }
}

export default RabbitMQBroker; // Ensure this is the default export
