import express, { Express } from 'express';
import { send } from 'process';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 
import { mockAuthenticator } from './fixtures/mockAuth';
import { EightyRouter } from './types/plugin';

describe('list', () => {
    ['mongodb'].forEach(db => {
        let fixtures: any;
        let eightyRouter: EightyRouter;
        let uut: Express;
        let tearDownEighty: () => Promise<void>;

        beforeAll(async () => {
            fixtures = await buildMongoFixtures();
            const { router, init, tearDown } = eighty({
                schemaRaw: testSchema
            });
            eightyRouter = router;

            uut = express();
            uut.use(mockAuthenticator);
            uut.use(router);

            tearDownEighty = tearDown;

            await init();
        });

        afterAll(async () => {
            await tearDownEighty();
            await cleanupMongoFixtures();
        });

    
        const testSchema = `
        version: "1.0.0" 

        database:
          type: ${db}

        resources:
          - name: user
            schemaPath: ./src/fixtures/schemas/user.yaml
            operations:
              list:
                authentication: false
                unknownFieldsPolicy: reject
          - name: book
            schemaPath: ./src/fixtures/schemas/book.yaml
            operations:
              list:
                authentication: true
                unknownFieldsPolicy: allow
        `;

        it(`${db}: lists resources`, async () => {
            await request(uut)
                .get('/users')
                .send()
                .expect(200)
                .expect(res => {
                    expect(res.body.results.length).toEqual(fixtures.users.length);
                    expect(res.body.total).toEqual(fixtures.users.length);
                });
        });

        it(`${db}: limits results`, async () => {
            // TODO: Check pagination values!
            await request(uut)
                .get('/users?count=2')
                .send()
                .expect(200)
                .expect(async res1 => {
                    expect(res1.body.results.length).toEqual(2);
                });
        });
            
        it(`${db}: skips results`, async () => {
            const skip = fixtures.users.length - 3;
            await request(uut)
                .get(`/users?skip=${skip}`)
                .send()
                .expect(200)
                .expect(res2 => {
                    expect(res2.body.results.length).toEqual(3)
                });
        });

        it(`${db}: applies filter operators`, async () => {
            await request(uut)
                .get('/users?age[gt]=40')
                .send()
                .expect(200)
                .expect(res => {
                    const filtered = fixtures.users
                        .filter((r: { age: number }) => r.age > 40);
                    expect(res.body.results.length).toEqual(filtered.length);
                    expect(res.body.total).toEqual(filtered.length);
                });
        });

        it(`${db}: applies multiple filters`, async () => {
            await request(uut)
                .get('/users?age[gt]=20&score[lt]=200')
                .send()
                .expect(200)
                .expect(res => {
                    expect(res.body.results.length).toEqual(1);
                });
        });

        it(`${db}: filters on id field`, async () => {
            const books = fixtures.books.slice(0, 2);
            // repeated notation
            const url1 = `/books?${books.map((book: any) => `id=${book._id.toString()}`).join('&')}`;
            // [in] notation
            const url2 = `/books?${books.map((book: any) => `id[in]=${book._id.toString()}`).join('&')}`;

            await request(uut)
                .get(url1)
                .set({ Authorization: 'userA' })
                .send()
                .expect(200)
                .expect(res => expect(res.body.results.length).toEqual(2));

            // await request(uut)
            //     .get(url2)
            //     .set({ Authorization: 'userA' })
            //     .send()
            //     .expect(200)
            //     .expect(res => expect(res.body.results.length).toEqual(2));
        });

        it(`${db}: applies filter operators on nested fields`, async () => {
            await request(uut)
                .get('/users?config.nickname[in]=aNickname&config.nickname[in]=dNickname')
                .send()
                .expect(200)
                .expect(res => expect(res.body.results.length).toEqual(2));
        });

        it(`${db}: rejects unauthenticated request for authenticated op`, async () => {
            await request(uut)
                .get('/books')
                .send()
                .expect(401);
        });

        it(`${db}: accepts authenticated request for authenticated op`, async () => {
            await request(uut)
                .get('/books?count=1')
                .set({ Authorization: 'userA' })
                .send()
                .expect(200)
                .expect(res => expect(res.body.results.length).toEqual(1));
        });

        it(`${db}: rejects filters on unknown fields when unknownFieldsPolicy: reject`, async () => {
            await request(uut)
                .get('/users?foo[gt]=aaa')
                .send()
                .expect(400);
        });

        it(`${db}: accepts filters on unkown fields (assuming they are strings) when unknownFieldsPolicy: accept`, async () => {
            await request(uut)
                .get('/books?notInSchema[gt]=aaa')
                .set({ Authorization: 'userA' })
                .send()
                .expect(200);
        });

        it(`${db}: sorts and orders`, async () => {
            await request(uut)
                .get('/users?sort=name&order=ASC')
                .send()
                .expect(200)
                .expect(res => {
                    const first = res.body.results[0];
                    const last = res.body.results[res.body.results.length-1];
                    expect(first.name <= last.name).toBeTruthy();
                });
            
                await request(uut)
                    .get('/users?sort=name&order=DESC')
                    .send()
                    .expect(200)
                    .expect(res => {
                        const first = res.body.results[0];
                        const last = res.body.results[res.body.results.length-1];
                        expect(first.name >= last.name).toBeTruthy();
                    });
        });

        it(`$${db}: queries for nested array fields containing single field`, async () => {
            await request(uut)
                .get('/users?interests[contains]=reading')
                .send()
                .expect(200)
                .expect(res => {
                    expect(res.body.results.length).toEqual(2);
                })
        });

        it(`${db}: queries for nested array fields containing multiple fields`, async () => {
            await request(uut)
                .get('/users?interests[contains]=reading&interests[contains]=arithmetic')
                .send()
                .expect(200)
                .expect(res => {
                    expect(res.body.results.length).toEqual(1);
                })
        });

        it(`${db}: correctly calls success callback`, async () => {
            const mockFn = jest.fn();

            eightyRouter
                .resources('book')
                .ops('list')
                .onSuccess((req, res) => {
                    mockFn(req.resource);
                });
            
            await request(uut)
                .get('/books')
                .set({ Authorization: 'userA' })
                .send()
                .expect(200)
                .expect(res => {
                    expect(mockFn).toHaveBeenCalledTimes(1);
                    expect(mockFn.mock.calls[0][0]).toEqual(res.body);
                });
        });
    });
});
