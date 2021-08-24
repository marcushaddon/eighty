import * as rt from 'runtypes';
import { OperationValidator, OperationNameValidator } from './operation';

export const ResourceValidator = rt.Record({
    name: rt.String,
    schemaPath: rt.Optional(rt.String),
    operations: rt.Optional(rt.Record({
        list: rt.Optional(OperationValidator),
        getOne: rt.Optional(OperationValidator),
        create: rt.Optional(OperationValidator),
        replace: rt.Optional(OperationValidator),
        update: rt.Optional(OperationValidator),
        delete: rt.Optional(OperationValidator),
    })) 
});

export type Resource = rt.Static<typeof ResourceValidator>;
