import { Router } from "express";
import { eighty } from "..";

const builder = eighty({
    schemaPath: './src/demo/demo.yaml',
});

builder
    .resources('book')
    .ops('create')
    .onSuccess((req, res, next) => {
        console.log('DEMO PLUGIN IN RUNNING!!!');
        next();
    })

const { router } = builder.build();
router.listen(4001, () => console.log('CRUD demo listening on port 4000'));
