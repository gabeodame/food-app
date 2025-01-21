"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('Ingredient Service API')
    .setDescription('API documentation for managing ingredients and inventory')
    .setVersion('1.0')
    .addTag('ingredient')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearerAuth')
    .build();
exports.swaggerOptions = {
    apis: ['./src/**/*.controller.ts', './src/**/*.dto.ts'],
};
//# sourceMappingURL=swagger.js.map