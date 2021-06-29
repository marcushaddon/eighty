import { eighty } from "../src";

const {
    init,
    tearDown,
    router: crudServer
} = eighty({
    schemaPath: './demo.yaml',
});

(async () => {
    await init();
    crudServer.listen(4001, () => console.log('CRUD demo listening on port 4000'));
})()

