import amqp, { Connection, Channel, Message } from "amqplib";

class RabbitMQBroker {
  private static instance: RabbitMQBroker;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  public static getInstance(): RabbitMQBroker {
    if (!RabbitMQBroker.instance) {
      RabbitMQBroker.instance = new RabbitMQBroker();
    }
    return RabbitMQBroker.instance;
  }

  public async init(url: string): Promise<void> {
    if (!url) {
      throw new Error("RabbitMQ connection URL is undefined.");
    }

    if (this.connection && this.channel) {
      return;
    }

    try {
      console.log("Connecting to RabbitMQ with URL:", url); // Debug logging
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      console.log("RabbitMQ connection and channel established.");

      process.on("SIGINT", this.closeConnection.bind(this));
      process.on("SIGTERM", this.closeConnection.bind(this));
    } catch (err) {
      console.error("Failed to connect to RabbitMQ:", err);
      throw err;
    }
  }

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

export default RabbitMQBroker;
