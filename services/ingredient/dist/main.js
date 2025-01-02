"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Ingredient Service API')
        .setDescription('API documentation for managing ingredients and inventory')
        .setVersion('1.0')
        .addTag('ingredients')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT ?? 3000;
    await app.listen(port, () => {
        console.log(`Listening on port ${port}`);
        console.log(`Swagger is available at http://localhost:${port}/api`);
    });
    await app.listen(process.env.PORT ?? 3000, () => {
        console.log(`Listening on port ${process.env.PORT ?? 3000}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map