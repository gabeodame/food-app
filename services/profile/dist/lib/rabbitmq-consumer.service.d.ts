export declare class RabbitMQConsumerService {
    consume(queue: string, onMessage: (msg: any) => Promise<void>): Promise<void>;
}
