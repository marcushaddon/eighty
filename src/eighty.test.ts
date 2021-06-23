import * as process from 'process';
import { Express } from 'express';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 
import { MongoClient, Db } from 'mongodb';

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
            name: test

        resources:
            - name: user
        `;

        it(`${db}: creates public getOne endpoints`, async () => {
            const existingId = fixtures.users[0]._id;
            const nonExistantId = '60d26b6c8ff5dd8ca441d514';

            await request(uut)
                .get(`/users/${existingId}`)
                .send()
                .expect(200);
            
            await request(uut)
                .get(`/users/${nonExistantId}`) // Doesnt exist
                .send()
                .expect(404);
        });

        it.skip(`${db}: creates public list endpoint`, async () => {
            const router = await eighty({
                schemaRaw: testSchema,
            });

            await request(router)
                .get('/user')
                .send()
                .expect(200)
                .expect(res => {
                    expect(res.body.results.length).toEqual(4);
                })
            
            await request(router)
                .get('/user?count=2')
                .send()
                .expect(200)
                .expect(res => expect(res.body.results.length).toEqual(2));
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
