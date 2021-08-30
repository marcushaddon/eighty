import express, { Handler, Express } from 'express';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures';
import { mockAuthenticator } from "./fixtures/mockAuth";

describe('replace', () => {
    ['mongodb'].forEach(db => {
        let cleanup: () => Promise<void>;
        let teardown: () => Promise<void>;
        let fixtures: {
            users: any[];
            books: any[];
        };
        let uut: Express;

        beforeAll(async() => {
            fixtures = await buildMongoFixtures();
            const { router, init, tearDown } = eighty({
                schemaRaw: `
                version: "1.0.0"

                database:
                  type: mongodb
                
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
            await cleanupMongoFixtures();
        });

        it(`${db}: rejects invalid replace`, async () => {
            const book = fixtures.books[0];
            const url = `/books/${book._id.toString()}`;

            await request(uut)
                .put(url)
                .send({
                    title: 5,
                    pages: 'one hundred',
                }).expect(400);
        });

        it(`${db}: rejects unauthorized replace for authorized op`, async () => {
            const book = fixtures.users[0];
            const url = `/users/${book._id.toString()}`;

            await request(uut)
                .put(url)
                .send({})
                .expect(401);
        })

        it(`${db}: performs valid unauthenticated replace`, async () => {
            const book = fixtures.books[0];
            const url = `/books/${book._id.toString()}`;

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
                id: book._id.toString()
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
            const user = fixtures.users[1];
            const url = `/users/${user._id.toString()}`;

            const newUser = {
               name: 'New person',
               age: 34,
               config: {
                   score: 100
               }
            };

            const expected = {
                ...newUser,
                id: user._id.toString()
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
            const url = `/books/${fixtures.books[0]._id.toString()}`;
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
            const url = `/books/${fixtures.books[0]._id.toString()}`;
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