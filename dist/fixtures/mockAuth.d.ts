import { Handler } from 'express';
export declare const mockAuthenticator: Handler;
export declare const fixtureAuthenticator: (userFixtures: {
    name: string;
    _id: any;
}[]) => Handler;
