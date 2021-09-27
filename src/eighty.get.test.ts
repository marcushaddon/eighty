import express, { Express } from 'express';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { eighty } from './eighty';
import { NotFoundError } from './errors';
import { mockAuthenticator } from './fixtures/mockAuth';
import { mockDbClient } from './fixtures/mockDb';
import { DbClients } from './db';

describe('getOne', () => {
    ['mongodb'].forEach(db => {
        DbClients.set('mock', () => mockDbClient);

        let uut: Express;
        let tearDownEighty: () => Promise<void>;
        let user: any;
        let book: any;
        let fixtures: {
            [ resourceName: string ]: { [ id: string ]: any };
        };

        beforeAll(async () => {
            uut = express();

            const { router, tearDown } = eighty({
                schemaRaw: `
                version: "1.0.0" 

                database:
                  type: mock

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
            }).build();

            uut.use(mockAuthenticator);
            uut.use(router);
            tearDownEighty = tearDown;
        });

        afterAll(async () => {
            await tearDownEighty();
        });

        beforeEach(() => {
            user = {
                name: 'mock',
                id: uuid(),
            };

            book = {
                title: 'mock',
                pages: 123,
                id: uuid(),
            }
            fixtures = {
                users: { [ user.id ]: user },
                books: { [ book.id ]: book },
            };

            mockDbClient.getById.mockImplementation((resource, id) => {
                if (fixtures[resource.name + 's']?.[id]) {
                    return fixtures[resource.name + 's']?.[id];
                }

                throw new NotFoundError(`Unable to find ${resource.name} with id ${id}`);
            });
        });

        afterEach(jest.clearAllMocks);

        it(`${db}: gets existing resource`, async () => {
            const existingId = user.id;

            await request(uut)
            .get(`/users/${existingId}`)
            .send()
            .expect(200)
            .expect(res => expect(res.body.id).toEqual(existingId));
        });
        
        it(`${db}: 404s for non existant resource`, async () => {
            const nonExistantId = '60d26b6c8ff5dd8ca441d514';

            await request(uut)
            .get(`/users/${nonExistantId}`)
            .send()
            .expect(404);
        });

        it(`${db}: rejects unauthenticated request for authenticated op`, async () => {
            const existingId = book.id;
            await request(uut)
                .get(`/books/${existingId}`)
                .send()
                .expect(401);
        });

        it(`${db}: allows authenticated request for authenticated op`, async () => {
            const existingId = book.id;
            await request(uut)
                .get(`/books/${existingId}`)
                .set({ Authorization: 'userB' })
                .send()
                .expect(200)
                .expect(res => {
                    expect(res.body.id).toEqual(existingId);
                });
        });
    });
});
