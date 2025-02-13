"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const ingredient_module_1 = require("./ingredient/ingredient.module");
const typeorm_1 = require("@nestjs/typeorm");
const ingredient_entity_1 = require("./lib/ingredient.entity");
const config_1 = require("@nestjs/config");
const common_2 = require("@gogittix/common");
const getOrmConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('POSTGRES_USER', 'default_user'),
    password: configService.get('POSTGRES_PASSWORD', 'default_password'),
    database: configService.get('POSTGRES_DB', 'default_db'),
    entities: [ingredient_entity_1.Ingredient],
    synchronize: configService.get('NODE_ENV') !== 'production',
});
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(common_2.currentUser, common_2.requireAuth).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV === 'development' ? '.env' : undefined,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => getOrmConfig(configService),
            }),
            ingredient_module_1.IngredientModule,
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map