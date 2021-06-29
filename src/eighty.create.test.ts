import { Express } from 'express';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 

describe('create', () => {
    ['mongodb'].forEach(db => {
        let fixtures: any;
        let uut: Express;
        let tearDownEighty: () => Promise<void>;

        beforeAll(async () => {
            fixtures = await buildMongoFixtures();

            const { router, init, tearDown } = eighty({
                schemaRaw: `
                version: "1.0.0" 

                database:
                  type: ${db}

                resources:
                  - name: user
                    schemaPath: ./src/fixtures/schemas/user.yaml
                `
            });

            uut = router;
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

        // it(`${db}: ignores`)
    });
});
