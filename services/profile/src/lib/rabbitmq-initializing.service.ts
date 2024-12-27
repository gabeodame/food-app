import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import RabbitMQBroker from './broker';

@Injectable()
export class RabbitMQInitializerService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    console.log('Initializing RabbitMQ...');

    const broker = RabbitMQBroker.getInstance(); // Correctly access the static method
    await broker.init(process.env.RABBITMQ_URL!); // Ensure the RabbitMQ URL is set in the environment variables

    console.log('RabbitMQ successfully initialized');
  }
}
