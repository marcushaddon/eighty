import request from "supertest";
import express, { Express } from 'express';
import { eighty } from ".";
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 
import { mockAuthenticator } from './fixtures/mockAuth';
import { EightySchema } from "./types/schema";

describe('plugins', () => {
    let fixtures: any;
    let uut: Express;
    const testSchema: EightySchema = {
        version: '1.0.0',
        database: { type: 'mongodb' },
        resources: [
            {
                name: 'book',
                schemaPath: './src/fixtures/schemas/book.ts',
                operations: {
                    create: {
                        authentication: true,
                    },
                    getOne: {
                        authentication: false,
                    },
                    list: {
                        authentication: false,
                    }
                }
            }
        ]
    };

    beforeAll(async () => {
        fixtures = await buildMongoFixtures();
    });

    afterAll(async () => {
        console.log('CLEARNING UP?');
        await cleanupMongoFixtures();
    });

    it('runs passthrough plugin on create', async () => {
        const builder = eighty({ schema: testSchema });
        const mockFn = jest.fn();
        builder
            .resources('book')
            .ops('create')
            .onSuccess((req, _, next) => {
                mockFn(req.resource);
                next();
            });

        const { router, tearDown } = builder.build();

        uut = express();
        uut.use(mockAuthenticator);
        uut.use(router);

        await request(uut)
            .post('/books')
            .set({ 'Authorization': 'userA' })
            .send({
                title: 'foobook',
                pages: 5,
                author: {
                    name: 'chrill',
                    age: 20,
                }
            }).expect(201)
            .expect(res => {
                expect(mockFn).toHaveBeenCalledTimes(1);
                expect(mockFn).toHaveBeenCalledWith(
                    expect.objectContaining({ title: 'foobook' })
                )
            })
            .then(async () => await tearDown());
    });

    it('runs effectful plugin on getOne', async () => {
        const builder = eighty({ schema: testSchema });

        builder
            .resources('book')
            .ops('getOne')
            .onSuccess((req, _, next) => {
                (req as any).status = 420;
                req.resource.title = 'MODIFIED';
                next();
            });
    
        const { router, tearDown } = builder.build();

        const uut = express();
        uut.use(mockAuthenticator);
        uut.use(router);

        const bookId = fixtures.books[0]._id.toString();
        await request(uut)
            .get(`/books/${bookId}`)
            .send()
            .expect(420)
            .expect(res => expect(res.body.title).toEqual('MODIFIED'))
            .then(async () => await tearDown());
    });

    it('runs short circuit plugin on list', async () => {
        const builder = eighty({ schema: testSchema });

        builder
            .resources('book')
            .ops('list')
            .onSuccess((req, res) => {
                const filtered = (req.resource.results as any[])
                    .filter((_, idx) => idx % 2 === 0);
                
                res.json(filtered).end();
            });
    
        const { router, tearDown } = builder.build();
        
        await request(router)
            .get('/books?count=10000000') // To get all of them
            .send()
            .expect(200)
            .expect(res => {
                expect(res.body.length).toBeLessThanOrEqual(
                    fixtures.books.length / 2 + 1
                )
            }).then(async () => await tearDown());
    });
});
