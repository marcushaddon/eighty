import * as process from 'process';

import { Db, MongoClient } from "mongodb";

export const users = [
    {
        name: "a",
        age: 10,
        score: 20
    },
    {
        name: "b",
        age: 20,
        score: 20
    },
    {
        name: "c",
        age: 30,
        score: 100
    },
    {
        name: "d",
        age: 40,
        score: 200
    },
    {
        name: "e",
        age: 50,
        score:3100
    },
];

let mongo: MongoClient;
let db: Db;
export const buildMongoFixtures = async () => {
    if (!mongo) {
        mongo = await MongoClient.connect(process.env.MONGO_URL!);
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


