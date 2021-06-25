import { Express } from 'express';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 
import { PaginatedResponse } from './types/api';

const mockService = {
    getOne() { return [{ name: 'test-user' }]}
}

describe('defaults', () => {
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

        it(`${db}: creates public getOne endpoints`, async () => {
            const existingId = fixtures.users[0]._id;
            const nonExistantId = '60d26b6c8ff5dd8ca441d514';

            await request(uut)
                .get(`/users/${existingId}`)
                .send()
                .expect(200);
            
            await request(uut)
                .get(`/users/${nonExistantId}`)
                .send()
                .expect(404);
        });

        it(`${db}: creates public list endpoint with pagination`, async () => {
            await request(uut)
                .get('/users')
                .send()
                .expect(200)
                .expect(res => {
                    expect(res.body.results.length).toEqual(fixtures.users.length);
                })
            
            let firstResponse: PaginatedResponse;
            let secondResponse: PaginatedResponse;
            
            // TODO: Check pagination values!
            await request(uut)
                .get('/users?count=2')
                .send()
                .expect(200)
                .expect(async res1 => {
                    expect(res1.body.results.length).toEqual(2);
                });

            await request(uut)
                .get('/users?skip=2')
                .send()
                .expect(200)
                .expect(res2 => {
                    expect(res2.body.results.length).toEqual(3)
                });
            
            await request(uut)
                .get('/users?age[gt]=40')
                .send()
                .expect(200)
                .expect(res => {
                    const filtered = res.body.results
                        .filter((r: { age: number }) => r.age > 40);
                    expect(filtered.length).toEqual(res.body.results.length);
                })
            
            await request(uut)
                .get('/users?age[gt]=20&score[lt]=200')
                .send()
                .expect(200)
                .expect(res => {
                    expect(res.body.results.length).toEqual(1);
                })
        });

        it.skip(`${db}: creates public create endpoint`, async () => {
            const router = eighty({
                schemaRaw: testSchema
            });

            await request(router)
                .post('/user')
                .send({
                    name: 'test-user'
                }).expect(201)
                .expect(res => {
                    expect(res.body.name).toEqual('test-user');
                    expect(res.body.id).toBeDefined();
                });
        })
    });
});
