import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Profile } from './profile/profile.entity'; // Import your entity

@Module({
  imports: [
    // Load environment variables from Kubernetes or .env (fallback for local dev)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env' : undefined,
    }),
    // TypeORM module with async configuration for Kubernetes secrets
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbConfig: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'), // Default to localhost for local dev
          port: configService.get<number>('DB_PORT', 5432), // Default to 5432 for PostgreSQL
          username: configService.get<string>('DB_USER', 'default_user'),
          password: configService.get<string>(
            'DB_PASSWORD',
            'default_password',
          ),
          database: configService.get<string>('DB_NAME', 'default_db'),
          entities: [Profile], // Specify entities explicitly
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true), // Enabled for dev, disable in prod
        };

        console.log('Database Configuration:', dbConfig); // Debugging log
        return dbConfig;
      },
    }),
    ProfileModule,
  ],
})
export class AppModule {}
