import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger';

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

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/1/profile/swagger', app, document); // Swagger UI will be available at /swagger

  const swaggerJsonPath = '/api/1/profile/swagger.json';
  app.use(swaggerJsonPath, (req, res) => {
    console.log('Serving swagger.json');
    res.status(200).json(document);
  });

  await app.listen(3000, () => {
    console.log('Listening on port 3000');
    console.log('Swagger is available at http://localhost:3000/swagger');
  });
}
bootstrap();
