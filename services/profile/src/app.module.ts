import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Profile } from './profile/profile.entity';

export const getOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('POSTGRES_USER', 'default_user'),
  password: configService.get<string>('POSTGRES_PASSWORD', 'default_password'),
  database: configService.get<string>('POSTGRES_DB', 'default_db'),
  entities: [Profile],
  // synchronize: configService.get<string>('NODE_ENV') !== 'production', // Disable in production
  synchronize: true,
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
    ProfileModule,
  ],
  providers: [],
})
export class AppModule {}
