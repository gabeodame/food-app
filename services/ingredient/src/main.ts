import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Ingredient Service API') // Update the title as needed
    .setDescription('API documentation for managing ingredients and inventory')
    .setVersion('1.0') // Version of your API
    .addTag('ingredients') // Tags to group endpoints in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/1/ingredient/swagger', app, document); // Swagger UI will be available at /api

  // Start the server
  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(`Swagger is available at http://localhost:${port}/swagger`);
  });
}
bootstrap();
