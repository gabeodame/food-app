"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata"); // Ensure it is imported first
const app_1 = __importDefault(require("./app"));
const consumeIngredient_1 = require("./utils/consumeIngredient");
const consumeUser_1 = require("./utils/consumeUser");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, consumeIngredient_1.consumeIngredient)();
            yield (0, consumeUser_1.consumeUser)();
            app_1.default.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }
        catch (error) {
            console.error("Failed to start the server:", error);
        }
    }))();
}
exports.default = app_1.default; // ✅ Export app for Jest to use
