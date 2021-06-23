import * as process from 'process';

import { Db, MongoClient } from "mongodb";

export const users = [
    {
        name: "a"
    },
    {
        name: "b"
    },
    {
        name: "c"
    },
    {
        name: "d"
    },
    {
        name: "e"
    },
];

let mongo: MongoClient;
let db: Db;
export const buildMongoFixtures = async () => {
    if (!mongo) {
        mongo = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING!);
        db = await mongo.db('local');
    }

    const fixtureRes = await Promise.all(users.map(u => db.collection('users').insertOne(u)));
    const mockUsers = fixtureRes.map(res => res.ops[0]);

    return { users: mockUsers };
};
export const cleanupMongoFixtures = async () => {
    if (!mongo) return;
    await db.dropCollection('users');
    await mongo.close();
};


