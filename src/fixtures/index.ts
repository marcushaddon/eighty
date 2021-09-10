import * as process from 'process';

import { Db, MongoClient } from "mongodb";

export const users = [
    {
        name: "userA",
        age: 10,
        score: 20,
        config: {
            nickname: 'aNickname'
        },
        interests: [ 'reading', 'writing' ],
    },
    {
        name: "userB",
        age: 20,
        score: 20,
        config: {
            nickname: 'bNickname'
        },
        interests: [ 'writing', 'arithmetic', ]
    },
    {
        name: "userC",
        age: 30,
        score: 100,
        config: {
            nickname: 'cNickname'
        },
        interests: [ 'reading', 'writing', 'arithmetic', 'art' ]
    },
    {
        name: "userD",
        age: 40,
        score: 200,
        config: {
            nickname: 'dNickname'
        }
    },
    {
        name: "userE",
        age: 50,
        score:3100,
        config: {
            nickname: 'eNickname'
        }
    },
    {
        name: "adminUser",
        age: 30,
        score: 1240,
        role: "admin"
    },

];

export const books = Array.from(Array(20).keys())
    .map(i => ({
        title: `Test Book ${i}`,
        pages: 10 * i,
        author: {
            name: 'Willy Shakespea' + 'r'.repeat(i),
            age: 5 * i,
        },
        themes: [ 'theme1', 'theme2' ]
    }));

let mongo: MongoClient;
let db: Db;
export const buildMongoFixtures = async () => {
    if (!mongo) {
        mongo = await MongoClient.connect(process.env.MONGO_URL!, { useUnifiedTopology: true });
        db = await mongo.db('local');
    }

    await db.createCollection('users');
    await db.createCollection('books');
    await db.createCollection('clubs');

    const usersRes = await Promise.all(users.map(u => db.collection('users').insertOne(u)));
    const mockUsers = usersRes.map(res => res.ops[0]);

    const booksRes = await Promise.all(books.map(book => db.collection('books').insertOne(book)));
    const mockBooks = booksRes.map(res => res.ops[0]);

    return { users: mockUsers, books: mockBooks, };
};
export const cleanupMongoFixtures = async () => {
    if (!mongo) return;
    await db.dropCollection('users');
    await db.dropCollection('books');
    await db.dropCollection('clubs')
    await mongo.close();
};


