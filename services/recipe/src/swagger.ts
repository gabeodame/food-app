import swaggerJsdoc from "swagger-jsdoc";
import { swaggerSchemas } from "../src/utils/swaggerSchema";

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
      schemas: swaggerSchemas,
    },
  },
  apis: ["./src/controllers/*.ts", "./src/dtos/*.ts"], // Adjust paths if necessary
};

export const swaggerSpec = swaggerJsdoc(options);
