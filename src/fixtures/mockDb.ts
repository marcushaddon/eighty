import { IDBClient } from "../db";

export const mockDbClient = {
    connect: jest.fn(),
    disconnect: jest.fn(),

    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    replace: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
