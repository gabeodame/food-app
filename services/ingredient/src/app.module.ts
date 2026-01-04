import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { IngredientModule } from './ingredient/ingredient.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Ingredient } from './lib/ingredient.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { currentUser, requireAuth } from '@gogittix/common'; // Import the middleware

const getOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('POSTGRES_USER', 'default_user'),
  password: configService.get<string>('POSTGRES_PASSWORD', 'default_password'),
  database: configService.get<string>('POSTGRES_DB', 'default_db'),
  entities: [Ingredient],
  synchronize: configService.get<string>('NODE_ENV') !== 'production', // Disable in production
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env' : undefined,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions =>
        getOrmConfig(configService),
    }),
    IngredientModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply currentUser to all routes, but allow public GET access
    consumer.apply(currentUser).forRoutes('*');
    consumer
      .apply(requireAuth)
      .exclude(
        { path: 'api/1/ingredient', method: RequestMethod.GET },
        { path: 'api/1/ingredient/:id', method: RequestMethod.GET },
        { path: 'api/1/ingredient/batch', method: RequestMethod.GET },
        { path: 'api/1/ingredient/search', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
