import express, { Express } from 'express'; 
import request from 'supertest';
import { eighty } from './eighty';
import { mockAuthenticator } from './fixtures/mockAuth';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures';

describe('update', () => {
    ['mongodb'].forEach(db => {
        let uut: Express;
        let fixtures: any;
        let teardown: () => Promise<void>;

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

            fixtures = await buildMongoFixtures();
            uut = express();
            uut.use(mockAuthenticator);

            const { router, init, tearDown } = await eighty({
                schemaRaw: testSchema,
            });

            teardown = tearDown;
            uut.use(router);

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

        
    });
    
})