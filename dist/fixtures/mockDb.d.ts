/// <reference types="jest" />
export declare const mockDbClient: {
    connect: jest.Mock<any, any>;
    disconnect: jest.Mock<any, any>;
    list: jest.Mock<any, any>;
    getById: jest.Mock<any, any>;
    create: jest.Mock<any, any>;
    replace: jest.Mock<any, any>;
    update: jest.Mock<any, any>;
    delete: jest.Mock<any, any>;
};
