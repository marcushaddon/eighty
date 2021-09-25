"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockDbClient = void 0;
exports.mockDbClient = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    replace: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
