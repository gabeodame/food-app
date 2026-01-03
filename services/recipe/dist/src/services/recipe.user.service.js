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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
class RecipeUserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.prisma.user.create({
                data: {
                    id: data.id,
                    email: data.email,
                    username: data.username,
                },
            });
            return user;
        });
    }
    handleDeadLetter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to handle dead-lettered messages
            console.log("Handling dead-lettered ingredient message:", data);
            yield this.createUser(data);
            console.log("User created from dead-lettered message.");
        });
    }
}
exports.default = new RecipeUserService();
