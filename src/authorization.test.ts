import express, { Express } from 'express';
import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import dm from 'deepmerge';
import request from 'supertest';
import { eighty } from './eighty';
import { EightySchema } from './types/schema';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures'; 
import { mockAuthenticator, fixtureAuthenticator } from './fixtures/mockAuth';

describe('authorization', () => {
    ['mongodb'].forEach(db => {
        let fixtures: any;
        let uut: Express;
        let tearDownEighty: () => Promise<void>;

        beforeAll(async () => {
            fixtures = await buildMongoFixtures();
        })

        beforeEach(async () => {
            uut = express();
            uut.use(mockAuthenticator);
        });

        afterAll(async () => {
            await cleanupMongoFixtures();
        });

        const userSchema = './src/fixtures/schemas/user.yaml';
        const bookSchema = './src/fixtures/schemas/book.yaml';

        it(`${db}: rejects update request without required role`, async () => {
            const schema: EightySchema = {
                version: '1.0.0',
                database: { type: 'mongodb' },
                resources: [{
                    name: 'book',
                    schemaPath: bookSchema,
                    operations: {
                        update: {
                            authentication: true,
                            authorization: {
                                allOf: [ { type: 'hasRole', role: 'youdonthavethisrole' }]
                            }
                        }
                    }
                }]
            } as EightySchema;

            const { router, init, tearDown } = eighty({ schema });
            uut.use(router);
            await init();

            const book = fixtures.books[0];
            const url = `/books/${book._id.toString()}`;
            await request(uut)
                .patch(url)
                .set({ Authorization: 'userA' })
                .send([
                    { op: 'replace', path: '/title', value: 'hacked' }
                ]).expect(403);
            
            await tearDown();
        });

        it(`${db}: rejects update request without being resource`, async () => {
            const user = fixtures.users[0];
            const url = `/users/${user._id.toString()}`;

            const schema: EightySchema = {
                version: '1.0.0',
                database: { type: 'mongodb' },
                resources: [{
                    name: 'user',
                    schemaPath: userSchema,
                    operations: {
                        update: {
                            authentication: true,
                            authorization: {
                                allOf: [ { type: 'isResource' }]
                            }
                        }
                    }
                }],
            } as EightySchema;

            const { router, init, tearDown } = eighty({ schema });
            uut.use(router);
            await init();

            await request(uut)
                .patch(url)
                .set({ Authorization: 'userA' })
                .send([
                    { op: 'replace', path: '/name', value: 'hacked' }
                ]).expect(403);

            await request(uut)
                .patch(url)
                .set({ Authorization: 'userB' })
                .send([
                    { op: 'replace', path: '/name', value: 'hacked' },
                ]).expect(403);

            await tearDown();
        });
    });
});
