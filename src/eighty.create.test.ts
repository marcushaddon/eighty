import express, { Express } from 'express';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures';
import { mockAuthenticator } from './fixtures/mockAuth';

describe('create', () => {
    ['mongodb'].forEach(db => {
        let fixtures: { users: any[]; books: any[] };
        let uut: Express;
        let tearDownEighty: () => Promise<void>;

        beforeAll(async () => {
            fixtures = await buildMongoFixtures();
            uut = express();

            const { router, init, tearDown } = eighty({
                schemaRaw: `
                version: "1.0.0" 

                database:
                  type: ${db}

                resources:
                  - name: user
                    schemaPath: ./src/fixtures/schemas/user.yaml
                  - name: book
                    schemaPath: ./src/fixtures/schemas/book.yaml
                    operations:
                      create:
                        authentication: true

                `
            });

            uut.use(mockAuthenticator);
            uut.use(router);
            tearDownEighty = tearDown;

            await init();
        });

        afterAll(async () => {
            await tearDownEighty();
            await cleanupMongoFixtures();
        });

        it(`${db}: creates a valid resource`, async () => {
            await request(uut)
                .post('/users')
                .send({
                    name: 'test-user',
                    age: 34
                })
                .expect(201)
                .expect(res => {
                    expect(res.body.id).toBeDefined();
                    expect(res.body.name).toEqual('test-user');
                    expect(res.body.age).toEqual(34);
                })
        });

        it(`${db}: rejects invalid resource`, async () => {
            await request(uut)
                .post('/users')
                .send({
                    name: 'invalid',
                    age: 'cool-user'
                }).expect(400);
        });

        it(`${db}: rejects unauthenticated request for authenticated op`, async () => {
            await request(uut)
                .post('/books')
                .send({
                    title: 'Unauthenticated Book',
                    pages: 35
                }).expect(401);
        });

        it(`${db}: accepts authenticated request for authenticated op`, async () => {
            await request(uut)
                .post('/books')
                .set({ 'Authorization': 'userA' })
                .send({
                    title: 'Authenticated Book',
                    pages: 24,
                    author: {
                        name: 'Authorntentcated',
                        age: 40
                    }
                }).expect(201)
                .expect(res => expect(res.body.createdBy).toEqual('userAID'));
        })
    });
});
