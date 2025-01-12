import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/1/ingredient/swagger', app, document);

  // Expose swagger.json
  const swaggerJsonPath = '/api/1/ingredient/swagger.json';
  app.use(swaggerJsonPath, (req, res) => {
    console.log('Serving Swagger JSON');
    console.log('req', req);
    res.status(200).json(document); // Serve the Swagger document as JSON
  });

  // Start the server
  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(
      `Swagger UI available at http://localhost:${port}/api/1/ingredient/swagger`,
    );
    console.log(
      `Swagger JSON available at http://localhost:${port}/api/1/ingredient/swagger.json`,
    );
  });
}
bootstrap();
