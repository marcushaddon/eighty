import { eighty } from "..";

const {
    init,
    tearDown,
    router: crudServer
} = eighty({
    schemaPath: './src/demo/demo.yaml',
});




crudServer.listen(4001, () => console.log('CRUD demo listening on port 4000'));


