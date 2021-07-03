import express, { Express } from 'express';
import request from 'supertest';
import { eighty } from './eighty';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 
import { mockAuthenticator } from './fixtures/mockAuth';

describe('authorization', () => {
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
                      update:
                        authentication: true
                        authorization:
                          anyOf:
                            - type: isResource
                            - type: hasRole
                              role: admin
                  - name: book
                    operations:
                      getOne:
                        authentication: true
                  - name: club
                    schemaPath: ./src/fixtures/schemas/club.yaml
                    operations:
                      list:
                        authentication: false
                      getOne:
                        authentication: false
                      create:
                        authentication: true
                        unknownFieldsPolicy: allow
                      update:
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

        it(`${db}: rejects unauthorized update request`, async () => {
            const user = fixtures.users[0];
            const url = `/users/${user._id.toString()}`;
            await request(uut)
                .patch(url)
                .set({ Authorization: 'userA' })
                .send([
                    { op: 'replace', path: '/name', value: 'hacked' }
                ]).expect(403);
        })
        
    });
});
