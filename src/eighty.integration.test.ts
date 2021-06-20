import request from 'supertest';
import { eighty } from './eighty';

const mockService = {
    getOne() { return [{ name: 'test-user' }]}
}

describe('defaults', () => {

    it('creates default endpoints', async () => {
        const router = eighty({
            schemaRaw: `
            version: "1.0.0" 

            resources:
                - name: user
            `
        });

        const res = await request(router)
            .get("/user")
            .send()
            .expect(200);
    })
});