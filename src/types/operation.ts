import * as rt from 'runtypes';

export const OperationNameValidator = rt.Union(
    rt.Literal('get'),
    rt.Literal('getOne'),
    rt.Literal('create'),
    rt.Literal('createOrUpdate'),
    rt.Literal('replace'),
    rt.Literal('update'),
    rt.Literal('delete'),
);

export type OperationName = rt.Static<typeof OperationNameValidator>;

export const OperationValidator = rt.Record({
    auth: rt.Optional(rt.String),
    disable: rt.Optional(rt.Boolean),
});

export type Operation = rt.Static<typeof OperationValidator>;
