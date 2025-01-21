"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("./swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const document = swagger_1.SwaggerModule.createDocument(app, swagger_2.swaggerConfig);
    swagger_1.SwaggerModule.setup('api/1/ingredient/swagger', app, document);
    const swaggerJsonPath = '/api/1/ingredient/swagger.json';
    app.use(swaggerJsonPath, (req, res) => {
        console.log('Serving Swagger JSON');
        console.log('req', req);
        res.status(200).json(document);
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port, () => {
        console.log(`Listening on port ${port}`);
        console.log(`Swagger UI available at http://localhost:${port}/api/1/ingredient/swagger`);
        console.log(`Swagger JSON available at http://localhost:${port}/api/1/ingredient/swagger.json`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map