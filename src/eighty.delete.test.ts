import express, { Handler, Express } from 'express';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures';
import { mockAuthenticator } from './fixtures/mockAuth';
import { mockDbClient } from './fixtures/mockDb';
import { eighty } from './eighty';
import { EightyRouter } from './types/plugin';
import { NotFoundError } from './errors';
import { loadSchema } from './buildResourceSchemas';

describe('delete', () => {
    ['mongodb'].forEach(db => {
        let uut: Express;

        let teardownEighty: () => Promise<void>;

        beforeAll(async () => {
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
                      delete:
                        authentication: true

                  - name: book
                    schemaPath: ./src/fixtures/schemas/book.yaml
                    operations:
                      getOne:
                        authentication: false
                      delete:
                        authentication: false
                `,
            }).build();

            teardownEighty = tearDown;

            uut = express();
            uut.use(mockAuthenticator);
            uut.use(router);
        });
        
        afterAll(async () => {
            await teardownEighty();
        });

        beforeEach(jest.clearAllMocks);

        it(`${db}: performs unauthenticated delete`, async () => {
            const mockBook = {
                id: uuid(),
                title: 'mock',
                pages: 123,
                author: {
                    name: 'author',
                }
            };

            const mockBooks = {
                [mockBook.id]: mockBook,
            }
            mockDbClient.delete.mockImplementation((_, id) => delete mockBooks[id]);
            mockDbClient.getById.mockImplementation((_, id) => {
                if (mockBooks[id]) {
                    return mockBooks[id];
                }

                throw new NotFoundError('Unable to find book with id: ' + id);
            })
            const url = `/books/${mockBook.id}`;

            await request(uut)
                .delete(url)
                .send()
                .expect(204);
            
            await request(uut)
                .get(url)
                .send()
                .expect(404);
        });

        it(`${db}: rejects unauthenticated request for authenticated op`, async () => {
            const user = {
                name: 'mock',
                id: uuid(),
            }
            const mockUsers = {
                [user.id]: user
            };

            mockDbClient.getById.mockImplementation((_, id) => {
                if (mockUsers[id]) return mockUsers[id];
                throw new NotFoundError('Cannot find user with id: ' + id);
            });
            mockDbClient.delete.mockImplementation((_, id) => delete mockUsers[id]);
            const url = `/users/${user.id}`;

            await request(uut)
                .delete(url)
                .send()
                .expect(401);

            await request(uut)
                .get(url)
                .send()
                .expect(200)
                .expect(res => expect(res.body.name).toEqual(user.name))
        });

        it(`${db}: performs authenticated op`, async () => {
            const user = {
                name: 'mock',
                id: uuid(),
            };

            const mockUsers = {
                [user.id]: user,
            };

            mockDbClient.getById.mockImplementation((_, id) => {
                if (mockUsers[id]) return mockUsers[id];
                throw new NotFoundError('Cannot find user with id: ' + id);
            });
            mockDbClient.delete.mockImplementation((_, id) => delete mockUsers[id]);

            const url = `/users/${user.id}`;

            await request(uut)
                .delete(url)
                .set({ Authorization: 'userA' })
                .send()
                .expect(204);
            
            await request(uut)
                .get(url)
                .send()
                .expect(404);
        });
    })
});
