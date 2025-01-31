import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '4mb' }));
  app.use(bodyParser.urlencoded({ limit: '4mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Uploads Service API')
    .setDescription('API documentation for managing file uploads')
    .setVersion('1.0')
    .addTag('uploads')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/1/uploads/swagger', app, document); // Swagger UI will be available at /swagger

  const swaggerJsonPath = '/api/1/uploads/swagger.json';
  app.use(swaggerJsonPath, (req, res) => {
    res.status(200).json(document);
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('Uploads Service');
    console.log(`Listening on port ${process.env.PORT ?? 3000}`);
    console.log(
      `Swagger is available at http://localhost:${process.env.PORT ?? 3000}/swagger`,
    );
  });
}
bootstrap();
