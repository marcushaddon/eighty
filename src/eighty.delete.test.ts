import express, { Handler, Express } from 'express';
import request from 'supertest';
import { buildMongoFixtures, cleanupMongoFixtures } from './fixtures';
import { mockAuthenticator } from './fixtures/mockAuth';
import { eighty } from './eighty';
import { EightyRouter } from './types/plugin';

describe('delete', () => {
    ['mongodb'].forEach(db => {
        let eightyRouter: EightyRouter;
        let uut: Express;
        let fixtures: {
            books: any[],
            users: any[]
        };

        let teardownEighty: () => Promise<void>;

        beforeAll(async () => {
            fixtures = await buildMongoFixtures();

            const { router, init, tearDown } = eighty({
                schemaRaw: `
                version: "1.0.0"

                database:
                  type: mongodb
                
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
            });

            eightyRouter = router;

            teardownEighty = tearDown;

            uut = express();
            uut.use(mockAuthenticator);
            uut.use(router);


            await init();
        });
        
        afterAll(async () => {
            await teardownEighty();
            await cleanupMongoFixtures();
        });

        it(`${db}: performs unauthenticated delete`, async () => {
            const book = fixtures.books[0];
            const url = `/books/${book._id.toString()}`;

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
            const user = fixtures.users[1];
            const url = `/users/${user._id.toString()}`;

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
            const user = fixtures.users[0];
            const url = `/users/${user._id.toString()}`;

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

        it(`${db}: correctly runs success callbacks`, async () => {
          const user = fixtures.users[1];
          const url = `/users/${user._id.toString()}`;

          const mockFn = jest.fn();

          eightyRouter
            .resources('user')
            .ops('delete')
            .onSuccess(req => mockFn(req.resource));
          
          await request(uut)
            .delete(url)
            .set({ Authorization: 'userA' })
            .send()
            .expect(204)
            .expect(res => {
              expect(mockFn).toHaveBeenCalledTimes(1);
              expect(mockFn.mock.calls[0][0].id).toEqual(user._id.toString());
            })
        });
    })
});
