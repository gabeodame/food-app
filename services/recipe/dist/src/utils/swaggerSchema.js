"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSchemas = void 0;
exports.swaggerSchemas = {
    CreateRecipeDto: {
        type: "object",
        required: [
            "title",
            "description",
            "imageUrl",
            "userId",
            "ingredients",
            "instructions",
        ],
        properties: {
            title: { type: "string", description: "Title of the recipe" },
            description: { type: "string", description: "Description of the recipe" },
            imageUrl: { type: "string", description: "Image URL for the recipe" },
            userId: {
                type: "string",
                description: "ID of the user who created the recipe",
            },
            categories: {
                type: "array",
                description: "Categories the recipe belongs to",
                items: { $ref: "#/components/schemas/CategoryDto" },
            },
            tags: {
                type: "array",
                description: "Tags associated with the recipe",
                items: { $ref: "#/components/schemas/TagDto" },
            },
            ingredients: {
                type: "array",
                description: "Ingredients required for the recipe",
                items: { $ref: "#/components/schemas/IngredientDto" },
            },
            instructions: {
                type: "array",
                description: "Instructions to prepare the recipe",
                items: { $ref: "#/components/schemas/InstructionDto" },
            },
            cuisineTypes: {
                type: "array",
                description: "Cuisine types associated with the recipe",
                items: { $ref: "#/components/schemas/CuisineTypeDto" },
            },
            seasonalEvent: {
                type: "array",
                description: "Seasonal events associated with the recipe",
                items: { $ref: "#/components/schemas/SeasonalEventDto" },
            },
            specialDiets: {
                type: "array",
                description: "Special diets the recipe adheres to",
                items: { $ref: "#/components/schemas/SpecialDietDto" },
            },
        },
    },
    UpdateRecipeDto: {
        type: "object",
        properties: {
            title: { type: "string", description: "Title of the recipe" },
            description: { type: "string", description: "Description of the recipe" },
            imageUrl: { type: "string", description: "Image URL for the recipe" },
            userId: {
                type: "string",
                description: "ID of the user who created the recipe",
            },
            categories: {
                type: "array",
                description: "Categories the recipe belongs to",
                items: { $ref: "#/components/schemas/CategoryDto" },
            },
            tags: {
                type: "array",
                description: "Tags associated with the recipe",
                items: { $ref: "#/components/schemas/TagDto" },
            },
            ingredients: {
                type: "array",
                description: "Ingredients required for the recipe",
                items: { $ref: "#/components/schemas/IngredientDto" },
            },
            instructions: {
                type: "array",
                description: "Instructions to prepare the recipe",
                items: { $ref: "#/components/schemas/InstructionDto" },
            },
            cuisineTypes: {
                type: "array",
                description: "Cuisine types associated with the recipe",
                items: { $ref: "#/components/schemas/CuisineTypeDto" },
            },
            seasonalEvent: {
                type: "array",
                description: "Seasonal events associated with the recipe",
                items: { $ref: "#/components/schemas/SeasonalEventDto" },
            },
            specialDiets: {
                type: "array",
                description: "Special diets the recipe adheres to",
                items: { $ref: "#/components/schemas/SpecialDietDto" },
            },
        },
    },
    CategoryDto: {
        type: "object",
        properties: {
            name: { type: "string", description: "Name of the category" },
        },
    },
    TagDto: {
        type: "object",
        properties: {
            name: { type: "string", description: "Name of the tag" },
        },
    },
    IngredientDto: {
        type: "object",
        required: ["name", "quantity"],
        properties: {
            name: { type: "string", description: "Name of the ingredient" },
            quantity: { type: "string", description: "Quantity of the ingredient" },
        },
    },
    InstructionDto: {
        type: "object",
        required: ["step"],
        properties: {
            step: { type: "string", description: "Step to prepare the recipe" },
        },
    },
    CuisineTypeDto: {
        type: "object",
        properties: {
            name: { type: "string", description: "Name of the cuisine type" },
        },
    },
    SeasonalEventDto: {
        type: "object",
        properties: {
            name: { type: "string", description: "Name of the seasonal event" },
        },
    },
    SpecialDietDto: {
        type: "object",
        properties: {
            name: { type: "string", description: "Name of the special diet" },
        },
    },
};
