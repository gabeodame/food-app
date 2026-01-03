"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.prisma = {
    recipe: {
        findMany: jest.fn(),
        findFirstOrThrow: jest.fn(),
        findFirst: jest.fn(), // ✅ Add missing method
        update: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
    },
    favorite: {
        findFirst: jest.fn(), // ✅ Ensure it exists
        create: jest.fn(),
        deleteMany: jest.fn(),
        delete: jest.fn(),
    },
};
