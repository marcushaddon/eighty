import express, { Express } from 'express'; 
import request from 'supertest';
import { eighty } from './eighty';
import { mockAuthenticator } from './fixtures/mockAuth';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures';
import { boolOptions } from 'yaml/types';

describe('update', () => {
    ['mongodb'].forEach(db => {
        let uut: Express;
        let fixtures: any;
        let teardown: () => Promise<void>;

        const bookBlueprint = {
            title: 'Blueprint',
            pages: 35,
            author: {
                name: 'Test author',
                age: 100
            }
        };

        beforeAll(async () => {
            const testSchema = `
            version: "1.0.0"

            database:
              type: ${db}
            
            resources:
              - name: book
                schemaPath: ./src/fixtures/schemas/book.yaml
                operations:
                  update:
                    authentication: true
            `;

            uut = express();
            uut.use(mockAuthenticator);

            const { router, init, tearDown } = await eighty({
                schemaRaw: testSchema,
            });

            teardown = tearDown;
            uut.use(router);

            fixtures = await buildMongoFixtures();

            await init();
        });

        afterAll(async () => {
            teardown && await teardown();
            await cleanupMongoFixtures();
        });

        it(`${db}: rejects unauthenticated request for authenticated op`, async () => {
            const id = fixtures.books[0]._id.toString();

            await request(uut)
                .patch(`/books/${id}`)
                .send([
                    { op: 'replace', path: '/author/name', value: 'New Name' }
                ]).expect(401);
        });

        it(`${db}: rejects invalid PATCH operation`, async () => {
            const id = fixtures.books[0]._id.toString();

            await request(uut)
                .patch(`/books/${id}`)
                .set({ Authorization: 'userA' })
                .send([
                    { op: 'foo', path: 4, value: 'wrong' } 
                ]).expect(400);
        });

        it(`${db}: rejects invalid PATCH for specific resource`, async () => {            
            await request(uut)
                .patch('/books/iDdoesntmattter')
                .set({ Authorization: 'userA' })
                .send([
                    { op: 'replace', path: '/author/age', value: 'shouldntbeastring' }
                ]).expect(400)
                .expect(res => expect(res.body.message).toContain('is not of a type(s)'))
        });

        // Book 0
        it(`${db}: applies valid replace operation`, async () => {
            const book = fixtures.books[0];

            const expected = {
                ...book,
                id: book._id.toString(),
                author: {
                    ...book.author,
                    age: 420
                }
            };

            delete expected._id;

            await request(uut)
                .patch(`/books/${book._id.toString()}`)
                .set({ Authorization: 'userA' })
                .send([
                    { 'op': 'replace', path: '/author/age', value: 420 }
                ]).expect(200);

            await request(uut)
                .get(`/books/${book._id.toString()}`)
                .send()
                .expect(res => {
                    expect(res.body.author.age).toEqual(420);
                })
        });

        it(`${db}: fails replace on nonexistent pointer`, async () => {
            const id = fixtures.books[1]._id.toString(); // Second book.author has no age field
            await request(uut)
                .patch(`/books/${id}`)
                .set({ Authorization: 'userA' })
                .send([
                    { op: 'replace', path: '/foo/bar', value: 20 }
                ]).expect(400);
        });

        // Book 1
        it(`${db}: applies add operation on unvalidated path`, async () => {
            const book = fixtures.books[1];
            const expected = {
                ...book,
                id: book._id.toString(),
                foo: 'bar',
                _id: undefined
            };

            await request(uut)
                .patch(`/books/${book._id.toString()}`)
                .set({ Authorization: 'userA' })
                .send([
                    { op: 'add', path: '/foo', value: 'bar'}
                ]).expect(200)

            await request(uut)
                .get(`/books/${book._id.toString()}`)
                .send()
                .expect(res => expect(res.body).toEqual(expected));
        });

        // Book 2
        it(`${db}: applies move op`, async () => {
            const book = fixtures.books[2];

            await request(uut)
                .patch(`/books/${book._id.toString()}`)
                .set({ Authorization: 'userA' })
                .send([
                    { op: 'move', from: '/author/age', path: '/pages' }
                ]).expect(200);

            await request(uut)
                .get(`/books/${book._id.toString()}`)
                .send()
                .expect(res => {
                    expect(res.body).toMatchObject({
                        pages: book.author.age
                    });
                    expect(res.body.author.age).toBeUndefined();
                });
        });

        // Book 3
        it(`${db}: applies remove operation on optional field`, async () => {
            const book = fixtures.books[3];
            const expected = {
                ...book,
                id: book._id.toString(),
            };
            delete expected._id;
            delete expected.author.age;

            await request(uut)
                .patch(`/books/${book._id.toString()}`)
                .set({ Authorization: 'userA' })
                .send([
                    { op: 'remove', path: '/author/age' }
                ]).expect(200)
            
            await request(uut)
                .get(`/books/${book._id.toString()}`)
                .send()
                .expect(res => expect(res.body.author.age).toBeUndefined());
        });

        
        // Book 4
        // TODO: applies copy op
        it(`${db}: applies valid copy op`, async () => {
            const book = fixtures.books[4];
            const expected = { 
                ...book,
                id: book._id.toString(),
                pages: book.author.age,
            };

            delete expected._id;

            const url = `/books/${book._id.toString()}`;

            await request(uut)
                .patch(url)
                .set({ Authorization: 'userC' })
                .send([
                    { op: 'copy', from: '/author/age', path: '/pages' }
                ]).expect(200);
            
            await request(uut)
                .get(url)
                .send()
                .expect(200)
                .expect(
                    res => expect(res.body).toEqual(expected)
                )
        })
        // Book 5
        // TODO: applies operation if test passes
        // TODO: doesnt apply operation if test fails (include one passing test)
        // TODO: rejects operation that puts resource into invalid state
        // Book 6
        // TODO: applies multiple valid ops
        // TODO: rejects all ops if one fails
    });
    
})