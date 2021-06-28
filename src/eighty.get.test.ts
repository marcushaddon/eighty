import { Express } from 'express';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 
import { PaginatedResponse } from './types/api';

const mockService = {
    getOne() { return [{ name: 'test-user' }]}
}

describe('getOne', () => {
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


        it('gets existing resource', async () => {
            const existingId = fixtures.users[0]._id;

            await request(uut)
            .get(`/users/${existingId}`)
            .send()
            .expect(200);
        });
        
        it('404s for non existant resource', async () => {
            const nonExistantId = '60d26b6c8ff5dd8ca441d514';

            await request(uut)
            .get(`/users/${nonExistantId}`)
            .send()
            .expect(404);
        });
    });
});
