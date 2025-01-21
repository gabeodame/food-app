"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Profile Service API')
        .setDescription('API documentation for managing user profiles')
        .setVersion('1.0')
        .addTag('profiles')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/1/profile/swagger', app, document);
    const swaggerJsonPath = '/api/1/profile/swagger.json';
    app.use(swaggerJsonPath, (req, res) => {
        res.status(200).json(document);
    });
    await app.listen(3000, () => {
        console.log('Listening on port 3000');
        console.log('Swagger is available at http://localhost:3000/swagger');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map