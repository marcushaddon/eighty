import * as rt from 'runtypes';
import { OperationValidator, OperationNameValidator } from './operation';

export const ResourceValidator = rt.Record({
    name: rt.String,
    schemaPath: rt.Optional(rt.String),
    operations: rt.Optional(rt.Dictionary(OperationValidator, OperationNameValidator))
});

export type Resource = rt.Static<typeof ResourceValidator>;
