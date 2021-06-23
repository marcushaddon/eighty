import * as process from 'process';
import request from 'supertest';
import { eighty } from './eighty';
import { MongoDbClient } from './db';
import { users } from './fixtures'; 
import { MongoClient, Db } from 'mongodb';

const mockService = {
    getOne() { return [{ name: 'test-user' }]}
}

describe('defaults', () => {

    ['mongodb'].forEach(db => {
        let connection: MongoClient;
        let mongo: Db;
        let mockUsers: any[];
        beforeAll(async () => {
            connection = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING!);
            mongo = connection.db('local');
            // TODO: Create fixtures
        });

        afterAll(async () => {
            await connection.close();
        });
    
        const testSchema = `
        version: "1.0.0" 

        database:
            type: ${db}
            name: test

        resources:
            - name: user
        `;

        // it('temp', () => expect(5).toEqual(5))
        it(`${db}: creates public getOne endpoints`, async () => {
            const router = await eighty({
                schemaRaw: testSchema
            });

            // await request(router)
            //     .get(`/user/${mockUsers[0].id}`)
            //     .send()
            //     .expect(200);
            
            // await request(router)
            //     .get('/user/idontexist')
            //     .send()
            //     .expect(404);
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
