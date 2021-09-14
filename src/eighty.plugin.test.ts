import request from "supertest";
import express, { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { eighty } from ".";
import { mockDbClient } from "./fixtures/mockDb";
import { mockAuthenticator } from './fixtures/mockAuth';
import { EightySchema } from "./types/schema";
import { NotFoundError } from "./errors";

describe('plugins', () => {
    let books: any[];
    let mockDb: any;
    let uut: Express;

    const testSchema: EightySchema = {
        version: '1.0.0',
        database: { type: 'mock' },
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

    beforeEach(() => {
        books = [ ...Array(30) ].map((_, i) => ({
            title: 'mock book',
            pages: 5 * i,
            id: uuid(),
        }));
        mockDb = {
            books: {}
        };

        for (const book of books) {
            mockDb.books[book.id] = book;
        }

        mockDbClient.create.mockImplementation((resource, pending, createdBy) => {
            const created = {
                ...pending,
                id: uuid(),
                createdBy,
            }
            mockDb[resource.name + 's'][created.id] = created;

            return created;
        });
        mockDbClient.getById.mockImplementation((resource, id) => {
            const existing = mockDb[resource.name + 's']?.[id];
            console.log('EXISTING', existing);
            if (!existing) throw new NotFoundError('Unable to find mock resource');

            return existing;
        });
        mockDbClient.list.mockImplementation(({ resource }) => {
            const res = Object.values(mockDb[resource.name + 's']);
            return {
                results: res,
                total: res.length,
            }
        });
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

        const bookId = books[0].id;
        const url = `/books/${bookId}`;
        await request(uut)
            .get(url)
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
                
                res.json({
                    ...req.resource,
                    results: filtered,
                }).end();
            });
    
        const { router, tearDown } = builder.build();
        
        await request(router)
            .get('/books?count=10000000') // To get all of them
            .send()
            .expect(200)
            .expect(res => {
                expect(res.body.results.length).toBeLessThanOrEqual(
                    books.length / 2 + 1
                )
            }).then(async () => await tearDown());
    });
});
