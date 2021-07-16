import express, { Express } from 'express';
import { send } from 'process';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures';
import { mockAuthenticator } from './fixtures/mockAuth';
import { EightyRouter } from './types/plugin';

describe('create', () => {
    ['mongodb'].forEach(db => {
        let fixtures: { users: any[]; books: any[] };
        let eightyRouter: EightyRouter;
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
                    operations:
                      create:
                        authentication: false
                  - name: book
                    schemaPath: ./src/fixtures/schemas/book.yaml
                    operations:
                      getOne:
                        authentication: false
                      create:
                        authentication: true

                `
            });

            eightyRouter = router;

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

        it(`${db}: validates array field`, async () => {
            await request(uut)
                .post('/books')
                .set({ Authorization: 'userA' })
                .send({
                    title: 'test',
                    pages: 100,
                    author: {
                        name: 'test author',
                    },
                    themes: [ 'technology' ]
                }).expect(201);
        });

        it(`${db}: invalidates array field`, async () => {
            await request(uut)
                .post('/books')
                .set({ Authorization: 'userA' })
                .send({
                    title: 'test',
                    pages: 100,
                    author: {
                        name: 'test',
                        age: 345
                    },
                    themes: [ 'technology', { name: 'the future' }]
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
        });

        it(`${db}: runs success callbacks`, async () => {
            const mockFn1 = jest.fn();
            const mockFn2 = jest.fn();
            eightyRouter
                .resources('book')
                .ops('create')
                .onSuccess((req, res) => {
                    mockFn1(req.resource);
                }).onSuccess((req) => {
                    mockFn2(req.resource);
                    mockFn2(req.resource);
                })

            await request(uut)
                .post('/books')
                .set({ Authorization: 'userA' })
                .send({
                    title: 'Test book',
                    pages: 32,
                    author: {
                        name: 'Test author',
                        age: 2354
                    }
                }).expect(201)
                .expect(res => {
                    expect(mockFn1).toHaveBeenCalledTimes(1);
                    expect(mockFn2).toHaveBeenCalledTimes(2);
                    expect(mockFn1.mock.calls[0][0]).toEqual(res.body);
                })
        });
    });
});
