"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.getOrmConfig = void 0;
const common_1 = require("@nestjs/common");
const profile_module_1 = require("./profile/profile.module");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const profile_entity_1 = require("./profile/profile.entity");
const getOrmConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USER', 'default_user'),
    password: configService.get('DB_PASSWORD', 'default_password'),
    database: configService.get('DB_NAME', 'default_db'),
    entities: [profile_entity_1.Profile],
    synchronize: configService.get('DB_SYNCHRONIZE', true),
});
exports.getOrmConfig = getOrmConfig;
let AppModule = class AppModule {
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
                useFactory: (configService) => (0, exports.getOrmConfig)(configService),
            }),
            profile_module_1.ProfileModule,
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map