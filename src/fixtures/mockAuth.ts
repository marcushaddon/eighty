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
    console.log({ mockToken, user: users[mockToken] }, 'MOCK AUTH');
    next();
};

export const fixtureAuthenticator = (userFixtures: { name: string, _id: any }[]): Handler => (req, res, next) => {
    const mockToken = (req.headers['authorization'] || 'NONE') as string;
    const users: { [ name: string ]: { name: string, id: string } } = {};
    userFixtures.forEach(user => users[user.name] = { ...user, id: user._id.toString() });

    (req as any).user = users[mockToken];
    next();
}
