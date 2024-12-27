import { Message } from "amqplib";
declare class RabbitMQBroker {
    private static instance;
    private connection;
    private channel;
    private constructor();
    /**
     * Gets the singleton instance of the RabbitMQBroker.
     */
    static getInstance(): RabbitMQBroker;
    /**
     * Initializes the connection and channel to RabbitMQ.
     * @param url - The RabbitMQ connection URL.
     */
    init(url: string): Promise<void>;
    /**
     * Publishes a message to a specified queue.
     * @param queue - The queue name.
     * @param message - The message to publish.
     */
    publish(queue: string, message: Buffer | string): Promise<void>;
    /**
     * Consumes messages from a specified queue.
     * @param queue - The queue name.
     * @param onMessage - Callback to handle incoming messages.
     */
    consume(queue: string, onMessage: (msg: Message) => Promise<void>): Promise<void>;
    /**
     * Closes the RabbitMQ connection and channel.
     */
    closeConnection(): Promise<void>;
}
export default RabbitMQBroker;
