"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerSchema_1 = require("../src/utils/swaggerSchema");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Recipe Service API",
            version: "1.0.0",
            description: "API for managing recipes",
        },
        servers: [
            {
                url: "/api/1/recipes",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT", // Specify that it's a JWT token
                },
            },
            security: [
                {
                    bearerAuth: [], // Apply bearer auth globally
                },
            ],
            schemas: swaggerSchema_1.swaggerSchemas,
        },
    },
    apis: ["./src/controllers/*.ts", "./src/dtos/*.ts"], // Adjust paths if necessary
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
