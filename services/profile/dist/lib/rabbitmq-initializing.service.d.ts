import { OnApplicationBootstrap } from '@nestjs/common';
export declare class RabbitMQInitializerService implements OnApplicationBootstrap {
    onApplicationBootstrap(): Promise<void>;
}
