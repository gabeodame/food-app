import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recipe Service API",
      version: "1.0.0",
      description: "API for managing recipes, ingredients, and more.",
    },
    servers: [
      {
        url: "/api/1/recipes",
        description: "Production server",
      },
    ],
  },
  apis: ["./src/controllers/*.ts", "./src/dtos/*.ts"], // Adjust paths if necessary
};

export const swaggerSpec = swaggerJsdoc(options);
