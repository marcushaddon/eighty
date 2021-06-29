import { Express } from 'express';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 
import { PaginatedResponse } from './types/api';

const mockService = {
    getOne() { return [{ name: 'test-user' }]}
}

describe('list', () => {
    ['mongodb'].forEach(db => {
        let fixtures: any;
        let uut: Express;
        let tearDownEighty: () => Promise<void>;

        beforeAll(async () => {
            fixtures = await buildMongoFixtures();
            const { router, init, tearDown } = eighty({
                schemaRaw: testSchema
            });

            uut = router;
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
            await request(uut)
                .get('/users?skip=2')
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

        it(`${db}: rejects filters for unknown fields`, async () => {
            await request(uut)
                .get('/users?unknownField=foo') // A field not in resources schema
                .send()
                .expect(400);
        });

        it(`${db}: applies filter operators on nested fields`, async () => {
            await request(uut)
                .get('/users?config.nickname[in]=aNickname&config.nickname[in]=dNickname')
                .send()
                .expect(200)
                .expect(res => expect(res.body.results.length).toEqual(2));
        });
    });
});
