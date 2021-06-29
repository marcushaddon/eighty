import { Handler } from 'express';

const userA = {
    id: 'userAID',
    name: 'userA'
};
const userB = {
    id: 'userBID',
    name: 'userB'
};
const userC = {
    id: 'userCID',
    name: 'userC'
};
const adminUser = {
    id: 'adminID',
    name: 'admin',
    role: 'ADMIN',
};
const superUser = {
    id: 'superUserID',
    name: 'super user',
    role: 'SUPER_USER'
};

export const mockAuthenticator: Handler = (req, res, next) => {
    const mockToken = (req.headers['authorization'] || 'NONE') as string;
    const users: { [ key: string ]: any} = {
        userA,
        userB,
        userC,
        adminUser,
        superUser,
    };
    (req as any).user = users[mockToken];
    next();
};
