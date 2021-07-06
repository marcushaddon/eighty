import express, { Express } from 'express';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 
import { mockAuthenticator } from './fixtures/mockAuth';

describe('getOne', () => {
    ['mongodb'].forEach(db => {
        let fixtures: any;
        let uut: Express;
        let tearDownEighty: () => Promise<void>;

        beforeAll(async () => {
            fixtures = await buildMongoFixtures();
            uut = express();

            const { router, init, tearDown } = eighty({
                schemaRaw: `
                version: "1.0.0" 

                database:
                  type: ${db}

                resources:
                  - name: user
                    schemaPath: ./src/fixtures/schemas/user.yaml
                    operations:
                      getOne:
                        authentication: false
                  - name: book
                    operations:
                      getOne:
                        authentication: true
                `
            });

            uut.use(mockAuthenticator);
            uut.use(router);
            tearDownEighty = tearDown;

            await init();
        });

        afterAll(async () => {
            await tearDownEighty();
            await cleanupMongoFixtures();
        });


        it(`${db}: gets existing resource`, async () => {
            const existingId = fixtures.users[0]._id.toString();

            await request(uut)
            .get(`/users/${existingId}`)
            .send()
            .expect(200)
            .expect(res => expect(res.body.id).toEqual(existingId.toString()));
        });
        
        it(`${db}: 404s for non existant resource`, async () => {
            const nonExistantId = '60d26b6c8ff5dd8ca441d514';

            await request(uut)
            .get(`/users/${nonExistantId}`)
            .send()
            .expect(404);
        });

        it(`${db}: rejects unauthenticated request for authenticated op`, async () => {
            const existingId = fixtures.books[0]._id;
            await request(uut)
                .get(`/books/${existingId}`)
                .send()
                .expect(401);
        });

        it(`${db}: allows authenticated request for authenticated op`, async () => {
            const existingId = fixtures.books[0]._id;
            await request(uut)
                .get(`/books/${existingId}`)
                .set({ Authorization: 'userB' })
                .send()
                .expect(200)
                .expect(res => {
                    expect(res.body.id).toEqual(existingId.toString());
                });
        });

        
    });
});
