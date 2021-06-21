import request from 'supertest';
import { eighty } from './eighty';

const mockService = {
    getOne() { return [{ name: 'test-user' }]}
}

describe('defaults', () => {

    const testSchema = `
    version: "1.0.0" 

    database:
        type: mock

    resources:
        - name: user
    `

    it('creates public getOne endpoints', async () => {
        const router = eighty({
            schemaRaw: testSchema
        });

        await request(router)
            .get('/user/a')
            .send()
            .expect(200);
        
        await request(router)
            .get('/user/idontexist')
            .send()
            .expect(404);
    });

    
});
