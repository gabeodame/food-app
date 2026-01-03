"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const recipe_routes_1 = __importDefault(require("./routes/recipe.routes"));
const common_1 = require("@gogittix/common");
const cookie_session_1 = __importDefault(require("cookie-session"));
const app = (0, express_1.default)();
app.set("trust proxy", true);
app.use(express_1.default.json());
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: process.env.NODE_ENV !== "development",
}));
app.use(common_1.currentUser);
// Swagger Documentation
app.use("/api/1/recipes/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Routes
app.use("/api/1/recipes", recipe_routes_1.default);
// Error Handler Middleware
app.use(common_1.errorHandler);
exports.default = app;
