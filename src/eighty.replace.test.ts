import express, { Handler, Express } from 'express';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { eighty } from './eighty';
import { NotFoundError } from './errors';
import { mockAuthenticator } from "./fixtures/mockAuth";
import { DbClients } from './db';
import { mockDbClient } from './fixtures/mockDb';

describe('replace', () => {
    ['mongodb'].forEach(db => {
        let teardown: () => Promise<void>;
        let user: any;
        let book: any;
        let mockDb: any;

        let fixtures: {
            users: any[];
            books: any[];
        };
        let uut: Express;

        beforeAll(async() => {
            DbClients.set('mock', () => mockDbClient);
            const { router, init, tearDown } = eighty({
                schemaRaw: `
                version: "1.0.0"

                database:
                  type: mock
                
                resources:
                  - name: user
                    schemaPath: ./src/fixtures/schemas/user.yaml
                    operations:
                      getOne:
                        authentication: false
                      replace:
                        authentication: true
                  - name: book
                    schemaPath: ./src/fixtures/schemas/book.yaml
                    operations:
                      getOne:
                        authentication: false
                      replace:
                        authentication: false
                `
            }).build();

            teardown = tearDown;

            uut = express();
            uut.use(mockAuthenticator);
            uut.use(router);

            await init();

        });

        afterAll(async() => {
            await teardown();
        });

        beforeEach(() => {
            user = {
                name: 'mockusers',
                id: uuid(),
            };

            book = {
                title: 'mock book',
                pages: 234,
                author: {
                    name: 'mock author',
                    age: 24,
                },
                themes: [ 'war', 'peace' ],
                id: uuid()
            };

            mockDb = {
                books: {
                    [book.id]: book,
                },
                users: {
                    [user.id]: user
                }
            };

            mockDbClient.replace.mockImplementation((resource, id, replacement, replacerId) => {
                const existing = mockDb[resource.name + 's']?.[id];
                if (!existing) throw new NotFoundError('Unable to find mock resource');
                mockDb[resource.name+'s'][id] = { ...replacement, id };
            });

            mockDbClient.getById.mockImplementation((resource, id) => {
                const res = mockDb[resource.name + 's']?.[id];
                if (res) return res;

                throw new NotFoundError('Unable to find mock resource');
            });
        });

        afterEach(jest.clearAllMocks);

        it(`${db}: rejects invalid replace`, async () => {
            const url = `/books/${book.id}`;

            await request(uut)
                .put(url)
                .send({
                    title: 5,
                    pages: 'one hundred',
                }).expect(400);
        });

        it(`${db}: rejects unauthorized replace for authorized op`, async () => {
            const url = `/users/${book.id}`;

            await request(uut)
                .put(url)
                .send({})
                .expect(401);
        })

        it(`${db}: performs valid unauthenticated replace`, async () => {
            const url = `/books/${book.id}`;

            const newBook = {
                title: 'New title',
                pages: 22,
                author: {
                    name: 'New author',
                    age: 55
                }
            };

            const expected = {
                ...newBook,
                id: book.id
            };

            await request(uut)
                .put(url)
                .send(newBook).expect(200);
            
            await request(uut)
                .get(url)
                .send()
                .expect(res => expect(res.body).toEqual(expected));
        });

        it(`${db}: performs valid authenticated replace`, async () => {
            const url = `/users/${user.id}`;

            const newUser = {
               name: 'New person',
               age: 34,
               config: {
                   score: 100
               }
            };

            const expected = {
                ...newUser,
                id: user.id
            };

            await request(uut)
                .put(url)
                .set({ Authorization: 'userA' })
                .send(newUser)
                .expect(200);

            await request(uut)
                .get(url)
                .send()
                .expect(res => expect(res.body).toEqual(expected));
        });

        it(`${db}: performds valid replace with nested array fields`, async () => {
            const url = `/books/${book.id}`;
            await request(uut)
                .put(url)
                .send({
                    title: 'new title',
                    pages: 3452,
                    author: {
                        name: 'new name',
                    },
                    themes: [ 'replacing things' ]
                }).expect(200);
        });

        it(`${db}: rejects invalid replace with nested array fields`, async () => {
            const url = `/books/${book.id}`;
            await request(uut)
                .put(url)
                .send({
                    title: 'new title',
                    pages: 3452,
                    author: {
                        name: 'new name',
                    },
                    themes: [ 'replacing things', 5 ]
                }).expect(400);
        });
    });
});