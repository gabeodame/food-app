import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Ingredient Service API')
  .setDescription('API documentation for managing ingredients and inventory')
  .setVersion('1.0')
  .addTag('ingredient') // Tag to group endpoints
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'bearerAuth', // Name of the security scheme (must match the component)
  )
  .build();

export const swaggerOptions = {
  apis: ['./src/**/*.controller.ts', './src/**/*.dto.ts'], // Adjust as needed
};
