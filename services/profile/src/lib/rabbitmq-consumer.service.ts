import { Injectable } from '@nestjs/common';
import RabbitMQBroker from './broker';

@Injectable()
export class RabbitMQConsumerService {
  async consume(queue: string, onMessage: (msg: any) => Promise<void>) {
    const broker = RabbitMQBroker.getInstance(); // Correctly access the static method
    await broker.consume(queue, onMessage);
  }
}
