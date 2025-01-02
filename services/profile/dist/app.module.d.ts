import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare const getOrmConfig: (configService: ConfigService) => TypeOrmModuleOptions;
export declare class AppModule {
}
