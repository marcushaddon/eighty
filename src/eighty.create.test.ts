import express, { Express } from 'express';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { eighty } from './eighty';
import { mockAuthenticator } from './fixtures/mockAuth';
import { mockDbClient } from './fixtures/mockDb';
import { DbClients } from './db';
import { RouterBuilder } from './RouterBuilder';

jest.mock('./db/mongodb', () => { })

describe('create', () => {
    ['mock'].forEach(db => { // TODO: dont loop over dbs
        const testSchema = `
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

        `;

        let builder: RouterBuilder;
        let uut: Express;
        let tearDownEighty: () => Promise<void>;

        beforeAll(async () => {
            DbClients.set('mock', () => mockDbClient);

            uut = express();

            builder = eighty({
                schemaRaw: testSchema,
            });

            const { router, tearDown } = builder.build();

            uut.use(mockAuthenticator);
            uut.use(router);
            tearDownEighty = tearDown;

        });

        afterAll(async () => {
            await tearDownEighty();
        });

        beforeEach(jest.clearAllMocks);

        it(`${db}: creates a valid resource`, async () => {
            const mockUser = {
                name: 'test-user',
                age: 34
            };
            const mockCreatedUser = {
                ...mockUser,
                id: uuid(),
            };
            mockDbClient.create.mockResolvedValue(mockCreatedUser);

            await request(uut)
                .post('/users')
                .send(mockUser)
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
            const mockBook = {
                title: 'test',
                pages: 100,
                author: {
                    name: 'test author',
                },
                themes: [ 'technology' ]
            };
            const mockCreated = {
                ...mockBook,
                id: uuid(),
            };
            mockDbClient.create.mockResolvedValue(mockCreated);
            await request(uut)
                .post('/books')
                .set({ Authorization: 'userA' })
                .send(mockBook).expect(201);
        });

        it(`${db}: invalidates array field`, async () => {
            const mockBook = {
                title: 'test',
                pages: 100,
                author: {
                    name: 'test',
                    age: 345
                },
                themes: [ 'technology', { name: 'the future' }]
            };

            await request(uut)
                .post('/books')
                .set({ Authorization: 'userA' })
                .send(mockBook).expect(400);
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
            const mockBook = {
                title: 'Authenticated Book',
                pages: 24,
                author: {
                    name: 'Authorntentcated',
                    age: 40
                }
            };
            mockDbClient.create.mockImplementation(async (_, pending, createdBy) => ({
                ...pending,
                id: uuid(),
                createdBy,
            }));

            await request(uut)
                .post('/books')
                .set({ 'Authorization': 'userA' })
                .send(mockBook).expect(201)
                .expect(res => {
                    expect(res.body.createdBy).toEqual('userAID');
                    expect(res.body.title).toEqual(mockBook.title);
                });
        });
    });
});
